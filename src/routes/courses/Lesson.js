import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { Draggable } from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DehazeIcon from '@material-ui/icons/Dehaze';

const styles = theme => ({
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    backgroundColor: 'white',
    border: 'solid 1px grey',
    marginBottom: '10px',
    position: 'relative',
  },
  header: {
    display: 'flex',
    marginBottom: '10px',
    '&:hover $hoverContainer': {
      visibility: 'visible',
    },
  },
  hoverContainer: {
    display: 'flex',
    visibility: 'hidden',
    flexGrow: 1,
  },
  lessonName: {
    marginRight: '5px',
  },
  headerIcon: {
    cursor: 'pointer',
    marginLeft: '5px',
    marginRight: '5px',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: '-25px',
    left: '-20px',
    zIndex: 1,
    '&:hover $addIcon': {
      visibility: 'visible',
    },
  },
  addIcon: {
    visibility: 'hidden',
    background: 'white',
    border: 'solid 1px #cac1c1',
    cursor: 'pointer',
  },
  addForChoosingIcon: {
    marginRight: theme.spacing.unit,
  },
  savePanel: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: '5px',
  }
});

const LessonHeader = ({classes, index, title, published}) => (
  <div className={classes.header}>
    <span>Lesson {index}: </span>
    <span className={classes.lessonName}>&nbsp;{title}</span>
    <div className={classes.hoverContainer}>
      <EditIcon className={classes.headerIcon} fontSize='small'/>
      <DeleteForeverIcon className={classes.headerIcon} fontSize='small'/>
      <div style={{flexGrow: 1}} />
      <DehazeIcon fontSize='small'/>
    </div>
  </div>
);

class Lesson extends React.PureComponent {
  state = {
    selectedType: null
  }

  renderVideoComponent = _ => {

  };

  renderArticleComponent = _ => {

  };

  renderFileComponent = _ => {

  };

  renderChoosingComponent = _ => {
    const { classes } = this.props;

    return (
      <div>
        <Fab variant="extended" aria-label="Delete" className={classes.fab}>
          <AddIcon className={classes.addForChoosingIcon} />
          Extended
        </Fab>
      </div>
    );
  };

  handleChange = (event, checked) => {
    this.props.onChange(
      this.props.draggableId,
      event.target.name,
      checked || event.target.value
    );
  };

  handleCancel = _ => {
    this.props.onCancel(this.props.draggableId);
  };

  handleSave = _ => {
    this.props.onSave(this.props.draggableId);
  };

  render() {
    const { selectedType } = this.state;
    const {
      classes,
      key,
      draggableId,
      index,
      type,
      title,
      uploadedLessonVideo,
      uploadedLessonFile,
      article,
      published,
      isEditing,
      error,
    } = this.props;

    let EditingComponent = null;

    switch(selectedType) {
      case 'video':
        EditingComponent = this.renderVideoComponent();
        break;
      case 'file':
        EditingComponent = this.renderFileComponent();
        break;
      case 'article':
        EditingComponent = this.renderArticleComponent();
        break;
      default:
        EditingComponent = this.renderChoosingComponent();
    }

    return (
      <Draggable 
        type='LESSON'
        index={index + 1}
        draggableId={draggableId} 
      >
        {provided => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={classes.container}
          >
            {isEditing ? (
              <div>
                {error.non_field_errors && (
                  <Typography variant='body1' className={classes.nonFieldError}>
                    {error.non_field_errors}
                  </Typography>
                )}
                {error.detail && (
                  <Typography variant='body1' className={classes.nonFieldError}>
                    {error.detail}
                  </Typography>
                )}
                <TextField
                  fullWidth
                  required
                  label='Title'
                  name='title'
                  variant='outlined'
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={title}
                  onChange={this.handleChange}
                  error={!!error.title}
                  helperText={error.title}
                />
                <div className={classes.savePanel}>
                  <Button
                    variant='outlined'
                    color='secondary'
                    className={classes.cancelButton}
                    onClick={this.handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button variant='outlined' color='primary' onClick={this.handleSave}>
                    Save Lesson
                  </Button>
                </div>
              </div>
            ) : (
              <React.Fragment>
                <LessonHeader 
                  title={title}
                  classes={classes}
                />
                <div className={classes.addButtonContainer}>
                  <button className={classes.addIcon} onClick={_ => {
                    console.log('click')
                  }}>
                    <AddIcon />
                  </button>
                </div>
              </React.Fragment>
            )}
          </div>
        )}
      </Draggable>
    );
  }
}

Lesson.propTypes = {
  classes: PropTypes.object,
  error: PropTypes.object,
  isEditing: PropTypes.bool,
  draggableId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['video', 'article', 'file', null]),
  title: PropTypes.string,
  published: PropTypes.bool,
  article: PropTypes.string,
  uploadedLessonVideo: PropTypes.number,
  uploadedLessonFile: PropTypes.number,
  onCreateNewSection: PropTypes.func,
  onEditSectionClick: PropTypes.func,
  onDeleteSectionClick: PropTypes.func,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

export default compose(
  withStyles(styles, { withTheme: true }),
)(Lesson);