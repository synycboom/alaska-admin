import React from 'react';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SelectInput from '../../components/SelectInput';
import SubCategoryService from '../../apis/SubCategoryService';
import CategoryService from '../../apis/CategoryService';
import Create from '../../components/Create';


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


class SubCategoryCreate extends React.PureComponent {
  subCategoryService = new SubCategoryService();
  categoryService = new CategoryService();
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
    this.setState({loading: true});
    this.categoryService.listAllCategories()
      .then(data => {
        this.setState({parentCategories: data.results.map(item => ({ value: item.id, label: item.name }))});
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
        this.setState({loading: false});
      })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSave = () => {
    const { enqueueSnackbar } = this.props;
    const { name, parent } = this.state;
    const data = { name, parent };

    this.setState({error: {...this.initialError}, loading: true});
    this.subCategoryService.createSubCategory(data)
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

  handleBack = () => {
    this.props.history.goBack();
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
      <Create 
        onSave={this.handleSave} 
        onBack={this.handleBack} 
        loading={loading}
        text='Create Sub-Category'
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

          <SelectInput
            textFieldProps={{
              label: 'Parent Category',
              variant: 'filled',
              margin: 'normal',
              error: !!error.parent,
              helperText: error.parent,
              InputLabelProps: {
                shrink: true,
              },
            }}
            name='parent'
            value={parent}
            options={parentCategories}
            onChange={this.handleChange}
          />
          
          <TextField
            fullWidth
            required
            label='Name'
            name='name'
            margin='normal'
            variant='filled'
            InputLabelProps={{
              shrink: true,
            }}
            value={name}
            onChange={this.handleChange}
            error={!!error.name}
            helperText={error.name}
          />
          
        </React.Fragment>
      </Create>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(SubCategoryCreate);