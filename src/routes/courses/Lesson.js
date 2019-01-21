import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import compose from 'recompose/compose';
import { Draggable } from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import VideocamIcon from '@material-ui/icons/Videocam';
import ReceiptIcon from '@material-ui/icons/Receipt';
import DehazeIcon from '@material-ui/icons/Dehaze';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Chip from '@material-ui/core/Chip';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

import TextEditor from '../../components/TextEditor';

const styles = theme => ({
  nonFieldError: {
    color: theme.palette.error.main,
  },
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
    alignItems: 'center',
    '&:hover $hoverContainer': {
      opacity: 1,
    },
  },
  hoverContainer: {
    display: 'flex',
    opacity: 0.1,
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
      opacity: 1,
    },
  },
  addIcon: {
    opacity: 0.5,
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
  },
  bottomNavigation: {
    border: '1px solid #e2e2e2'
  },
  bottomNavigationError: {
    borderColor: theme.palette.error.main,
  },
  editingSection: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
  },
});

const LessonHeader = ({classes, index, title, published, onDeleteClick, onEditClick}) => (
  <div className={classes.header}>
    {published ? (
      <CheckCircleOutlineIcon color='primary'/>
    ) : (
      <HighlightOffIcon color='secondary'/>
    )}
    <span>&nbsp; Lesson {index}: </span>
    <span className={classes.lessonName}>&nbsp;{title}</span>
    <div className={classes.hoverContainer}>
      <EditIcon className={classes.headerIcon} fontSize='small' onClick={onEditClick}/>
      <DeleteForeverIcon className={classes.headerIcon} fontSize='small' onClick={onDeleteClick}/>
      <div style={{flexGrow: 1}} />
      <DehazeIcon fontSize='small'/>
    </div>
  </div>
);

class Lesson extends React.PureComponent {
  renderVideoComponent = _ => {
    const { classes, uploadedLessonVideoName } = this.props;
    return (
      <div>
        <Button
          variant='contained'
          color='secondary'
          className={classes.button}
          onClick={this.handleOpenModSelectVideo}
        >
          Choose
          <FolderOpenIcon className={classes.rightIcon} />
        </Button>
        <Button
          variant='contained'
          color='default'
          className={classes.button}
          onClick={this.handleOpenModUploadVideo}
        >
          Upload
          <CloudUploadIcon className={classes.rightIcon} />
        </Button>

        {uploadedLessonVideoName && (
          <Chip
            icon={<VideocamIcon />}
            label={`File: ${uploadedLessonVideoName}`}
            clickable
            color='primary'
            onDelete={this.handleDiscardVideo}
          />
        )}
      </div>
    );
  };

  renderFileComponent = _ => {
    const { classes, uploadedLessonFileName } = this.props;
    return (
      <div>
        <Button
          variant='contained'
          color='secondary'
          className={classes.button}
          onClick={this.handleOpenModSelectFile}
        >
          Choose
          <FolderOpenIcon className={classes.rightIcon} />
        </Button>
        <Button
          variant='contained'
          color='default'
          className={classes.button}
          onClick={this.handleOpenModUploadFile}
        >
          Upload
          <CloudUploadIcon className={classes.rightIcon} />
        </Button>

        {uploadedLessonFileName && (
          <Chip
            icon={<FileCopyIcon />}
            label={`File: ${uploadedLessonFileName}`}
            clickable
            color='primary'
            onDelete={this.handleDiscardFile}
          />
        )}
      </div>
    );
  };

  renderArticleComponent = _ => {
    const { article } = this.props;

    return (
      <TextEditor
        label='Article'
        name='article'
        value={article}
        onChange={this.handleChange}
      />
    );
  };

  handleAddLesson = _ => {
    this.props.onAddLesson(this.props.index + 1);
  };

  handleChange = (event, checked) => {
    this.props.onChange(
      this.props.draggableId,
      event.target.name,
      typeof checked === 'undefined' ? event.target.value : checked
    );
  };

  handleTypeChange = (_, value) => {
    this.props.onChange(
      this.props.draggableId,
      'type',
      value,
    );
  };

  handleDiscardVideo = _ => {
    this.props.onChange(
      this.props.draggableId,
      'uploaded_lesson_video_name',
      '',
    );
    
    // WTF happens here, It won't work if we don't wrap the onChange() in setTimeout?
    setTimeout(_ => {
      this.props.onChange(
        this.props.draggableId,
        'uploaded_lesson_video',
        null,
      );
    });
  };

  handleDiscardFile = _ => {
    this.props.onChange(
      this.props.draggableId,
      'uploaded_lesson_file_name',
      '',
    );

    setTimeout(_ => {
      this.props.onChange(
        this.props.draggableId,
        'uploaded_lesson_file',
        null,
      );
    });
  };

  handleOpenModUploadVideo = () => {
    this.props.onOpenModUploadVideo(this.props.draggableId);
  };

  handleOpenModUploadFile = () => {
    this.props.onOpenModUploadFile(this.props.draggableId);
  };

  handleOpenModSelectFile = () => {
    this.props.onOpenModSelectFile(this.props.draggableId);
  };

  handleOpenModSelectVideo = () => {
    this.props.onOpenModSelectVideo(this.props.draggableId);
  };

  handleCancel = _ => {
    if (this.props.isCreated) {
      this.props.onCancel(this.props.draggableId);
    } else {
      this.props.onDeleteLesson(this.props.draggableId);
    }
  };

  handleEditClick = _ => {
    this.props.onEditLesson(this.props.draggableId);
  };

  handleDeleteClick = _ => {
    this.props.onDeleteLesson(this.props.draggableId);
  };

  handleSave = _ => {
    this.props.onSave(this.props.draggableId);
  };

  render() {
    const {
      classes,
      draggableId,
      index,
      type,
      title,
      published,
      isEditing,
      isCreated,
      error,
    } = this.props;

    let EditingComponent = null;

    switch(type) {
      case 'video':
        EditingComponent = this.renderVideoComponent();
        break;
      case 'file':
        EditingComponent = this.renderFileComponent();
        break;
      case 'article':
        EditingComponent = this.renderArticleComponent();
        break;
    }

    return (
      <Draggable 
        type='LESSON'
        index={index}
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

                <BottomNavigation
                  value={type} 
                  onChange={this.handleTypeChange} 
                  className={
                    classNames( classes.bottomNavigation, { [classes.bottomNavigationError]: error.type })
                  }
                >
                  <BottomNavigationAction label='Video' value='video' icon={<VideocamIcon />} />
                  <BottomNavigationAction label='File' value='file' icon={<FileCopyIcon />} />
                  <BottomNavigationAction label='Article' value='article' icon={<ReceiptIcon />} />
                </BottomNavigation>
                

                {EditingComponent && (
                  <div className={classes.editingSection}>
                    {EditingComponent}
                  </div>
                )}
                
                <FormControlLabel
                  label='Publish This Section'
                  control={
                    <Switch
                      checked={published}
                      onChange={this.handleChange}
                      name='published'
                      color='primary'
                    />
                  }
                />

                <div className={classes.savePanel}>
                  {!isCreated && (
                    <Button
                      variant='outlined'
                      color='secondary'
                      className={classes.cancelButton}
                      onClick={this.handleCancel}
                    >
                      CANCEL
                    </Button>
                  )}

                  <Button 
                    variant='outlined' 
                    color='primary' 
                    onClick={this.handleSave}
                  >
                    OK
                  </Button>
                </div>
              </div>
            ) : (
              <React.Fragment>
                <LessonHeader 
                  title={title}
                  classes={classes}
                  index={index + 1}
                  published={published}
                  onEditClick={this.handleEditClick}
                  onDeleteClick={this.handleDeleteClick}
                />
                <div className={classes.addButtonContainer}>
                  <button className={classes.addIcon} onClick={this.handleAddLesson}>
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
  isCreated: PropTypes.bool,
  draggableId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['video', 'article', 'file', null]),
  title: PropTypes.string,
  published: PropTypes.bool,
  article: PropTypes.string,
  uploadedLessonVideoName: PropTypes.string,
  uploadedLessonVideo: PropTypes.number,
  uploadedLessonFileName: PropTypes.string,
  uploadedLessonFile: PropTypes.number,
  onAddLesson: PropTypes.func,
  onEditLesson: PropTypes.func,
  onDeleteLesson: PropTypes.func,
  onOpenModSelectVideo: PropTypes.func,
  onOpenModUploadVideo: PropTypes.func,
  onOpenModUploadFile: PropTypes.func,
  onOpenModSelectFile: PropTypes.func,
  onChange: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

export default compose(
  withStyles(styles, { withTheme: true }),
)(Lesson);