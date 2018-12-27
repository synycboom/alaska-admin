import React from 'react';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import SubCategoryService from '../../apis/SubCategoryService';
import Edit from '../../components/Edit';


const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  otherError: {
    color: theme.palette.error.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});


class SubCategoryEdit extends React.PureComponent {
  subCategoryService = new SubCategoryService();
  initialError = {
    parent: '',
    name: '',
    non_field_errors: '',
    detail: '',
  }
  state = {
    parentCategories: [],
    parent: '',
    name: '',
    loading: false,
    error: {...this.initialError},
  };

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const { match: { params } } = this.props;

    this.setState({ loading: true });

    const promise1 = this.subCategoryService.listParentCategories()
      .then(data => {
        this.setState({parentCategories: data.results});
      })
      .catch(error => {
        let newError = {};
        
        for (let key in error) {
          if (error.hasOwnProperty(key)) {
            newError[key] = error[key];  
          }
        }
        this.setState({error: newError});
      });

    const promise2 = this.subCategoryService.getSubCategory(params.id)
      .then(data => this.setState({
        name: data.name,
        parent: data.parent,
      }))
      .catch(error => {
        let newError = {};
        
        for (let key in error) {
          if (error.hasOwnProperty(key)) {
            newError[key] = error[key];  
          }
        }
        this.setState({error: newError});
      });

    Promise.all([promise1, promise2])
      .then(() => null)
      .catch(() => null)
      .then(() => this.setState({loading: false}));
  }

  handleBack = () => {
    this.props.history.goBack();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSave = () => {
    const { enqueueSnackbar, match: { params } } = this.props;
    const { name, parent } = this.state;
    const data = { name, parent };

    this.setState({error: {...this.initialError}, loading: true});
    this.subCategoryService.updateSubCategory(params.id, data)
      .then(data => {
        enqueueSnackbar(data.detail, { variant: 'success' });
      })
      .catch(error => {
        let newError = {};
        
        for (let key in error) {
          if (error.hasOwnProperty(key)) {
            newError[key] = error[key];  
          }
        }
        
        this.setState({error: newError});
      })
      .then(() => {
        this.setState({ 
          loading: false 
        });
      })
  }
  
  handleDelete = () => {
    const { enqueueSnackbar, match: { params } } = this.props;

    this.setState({error: {...this.initialError}, loading: true});
    this.subCategoryService.deleteSubCategory(params.id)
      .then(data => {
        enqueueSnackbar(data.detail, { variant: 'success' });
        this.handleBack();
      })
      .catch(error => {
        let newError = {};
        
        for (let key in error) {
          if (error.hasOwnProperty(key)) {
            newError[key] = error[key];  
          }
        }
        
        this.setState({error: newError});
      })
      .then(() => {
        this.setState({ 
          loading: false 
        });
      })
  }

  render() {
    const { classes } = this.props;
    const {
      error,
      name,
      parent,
      loading,
      parentCategories,
    } = this.state;

    return (
      <Edit 
        onSave={this.handleSave} 
        onBack={this.handleBack} 
        onDelete={this.handleDelete} 
        loading={loading}
        text='Edit Sub-Category'
        confirmDeleteDetail="Courses' sub-categories will be set to null."
      >
        <React.Fragment>
          {error.non_field_errors && (
            <Typography variant='body1' className={classes.otherError}>
              {error.non_field_errors}
            </Typography>
          )}

          {error.detail && (
            <Typography variant='body1' className={classes.otherError}>
              {error.detail}
            </Typography>
          )}
          
          <FormControl required fullWidth>
            <InputLabel htmlFor='parent'>Parent Category</InputLabel>
            <Select
              value={parent}
              onChange={this.handleChange}
              inputProps={{ name: 'parent', id: 'parent' }}
            >
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>

              {parentCategories.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}

            </Select>

            {error.parent && (
              <FormHelperText error>{error.parent}</FormHelperText>
            )}
          </FormControl>

          <FormControl margin='normal' required fullWidth>
            <InputLabel htmlFor='name'>Name</InputLabel>
            <Input 
              id='name' 
              name='name' 
              value={name}
              autoFocus
              onChange={this.handleChange} 
              error={!!error.name}
            />
            {error.name && (
              <FormHelperText error>{error.name}</FormHelperText>
            )}
          </FormControl>

        </React.Fragment>
      </Edit>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(SubCategoryEdit);