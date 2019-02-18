import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DehazeIcon from '@material-ui/icons/Dehaze';
import AddIcon from '@material-ui/icons/Add';
import Lesson from './Lesson';

const styles = theme => ({
  nonFieldError: {
    color: theme.palette.error.main
  },
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    backgroundColor: '#f2f2f5',
    border: 'solid 1px grey',
    marginBottom: '10px',
    position: 'relative'
  },
  header: {
    display: 'flex',
    marginBottom: '10px',
    alignItems: 'center',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    '&:hover $hoverContainer': {
      opacity: 1
    }
  },
  hoverContainer: {
    display: 'flex',
    opacity: 0.1,
    flexGrow: 1
  },
  sectionName: {
    marginRight: '5px'
  },
  headerIcon: {
    cursor: 'pointer',
    marginLeft: '5px',
    marginRight: '5px'
  },
  droppableArea: {
    minHeight: '25px'
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: '-25px',
    left: '-20px',
    zIndex: 1,
    '&:hover $addIcon': {
      opacity: 1
    }
  },
  addIcon: {
    opacity: 0.5,
    background: 'white',
    border: 'solid 1px #cac1c1',
    cursor: 'pointer'
  },
  savePanel: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  cancelButton: {
    marginRight: '5px'
  }
});

const SectionHeader = ({
  classes,
  index,
  title,
  published,
  onEditClick,
  onDeleteClick
}) => (
  <div className={classes.header}>
    {published ? (
      <CheckCircleOutlineIcon color="primary" />
    ) : (
      <HighlightOffIcon color="secondary" />
    )}
    <span>&nbsp; Section {index}: </span>
    <span className={classes.sectionName}>&nbsp;{title}</span>
    <div className={classes.hoverContainer}>
      <EditIcon
        className={classes.headerIcon}
        fontSize="small"
        onClick={onEditClick}
      />
      <DeleteForeverIcon
        className={classes.headerIcon}
        fontSize="small"
        onClick={onDeleteClick}
      />
      <div style={{ flexGrow: 1 }} />
      <DehazeIcon fontSize="small" />
    </div>
  </div>
);

class Section extends React.PureComponent {
  state = {};

  handleChange = (event, checked) => {
    this.props.onSectionDataChange(
      this.props.draggableId,
      event.target.name,
      typeof checked === 'undefined' ? event.target.value : checked
    );
  };

  handleEditClick = _ => {
    this.props.onEditSectionClick(this.props.draggableId);
  };

  handleDeleteClick = _ => {
    this.props.onDeleteSectionClick(this.props.draggableId);
  };

  handleCancel = _ => {
    if (this.props.isCreated) {
      this.props.onCancelSection(this.props.draggableId);
    } else {
      this.props.onDeleteSectionClick(this.props.draggableId);
    }
  };

  handleSave = _ => {
    this.props.onSaveSection(this.props.draggableId);
  };

  handleAddSection = _ => {
    this.props.onAddNewSection(this.props.index + 1);
  };

  // ----------------------------------------------------------------- LESSON
  handleAddLesson = index => {
    this.props.onAddLesson(this.props.draggableId, index);
  };

  handleCancelLesson = lessonUUID => {
    this.props.onCancelLesson(this.props.draggableId, lessonUUID);
  };

  handleDeleteLesson = lessonUUID => {
    this.props.onDeleteLesson(this.props.draggableId, lessonUUID);
  };

  handleEditLesson = lessonUUID => {
    this.props.onEditLesson(this.props.draggableId, lessonUUID);
  };

  handleSaveLesson = lessonUUID => {
    this.props.onSaveLesson(this.props.draggableId, lessonUUID);
  };

  render() {
    const {
      classes,
      draggableId,
      index,
      title,
      description,
      published,
      lessons,
      isEditing,
      isCreated,
      error,

      onLessonDataChange,
      onOpenModSelectVideo,
      onOpenModUploadVideo,
      onOpenModUploadFile,
      onOpenModSelectFile
    } = this.props;

    console.log(lessons);
    return (
      <Draggable type="SECTION" index={index} draggableId={draggableId}>
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
                  <Typography variant="body1" className={classes.nonFieldError}>
                    {error.non_field_errors}
                  </Typography>
                )}
                {error.detail && (
                  <Typography variant="body1" className={classes.nonFieldError}>
                    {error.detail}
                  </Typography>
                )}
                <TextField
                  fullWidth
                  required
                  label="Title"
                  name="title"
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={title}
                  onChange={this.handleChange}
                  error={!!error.title}
                  helperText={error.title}
                />
                <TextField
                  fullWidth
                  label="What will students be able to do at the end of this section?"
                  name="description"
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={description}
                  onChange={this.handleChange}
                  error={!!error.description}
                  helperText={error.description}
                />
                <FormControlLabel
                  label="Publish This Section"
                  control={
                    <Switch
                      checked={published}
                      onChange={this.handleChange}
                      name="published"
                      color="primary"
                    />
                  }
                />
                <div className={classes.savePanel}>
                  {!isCreated && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.cancelButton}
                      onClick={this.handleCancel}
                    >
                      CANCEL
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={this.handleSave}
                  >
                    OK
                  </Button>
                </div>
              </div>
            ) : (
              <React.Fragment>
                <SectionHeader
                  index={index + 1}
                  title={title}
                  description={description}
                  published={published}
                  classes={classes}
                  onEditClick={this.handleEditClick}
                  onDeleteClick={this.handleDeleteClick}
                />
                <Droppable droppableId={draggableId} type="LESSON">
                  {provided => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={classes.droppableArea}
                    >
                      {lessons.length ? (
                        lessons.map((lesson, index) => (
                          <Lesson
                            key={lesson.uuid}
                            draggableId={lesson.uuid}
                            index={index}
                            isEditing={lesson.isEditing}
                            isCreated={lesson.isCreated}
                            error={lesson.error}
                            type={lesson.type}
                            title={lesson.title}
                            uploadedLessonVideoName={
                              lesson.uploaded_lesson_video_name
                            }
                            uploadedLessonVideo={lesson.uploaded_lesson_video}
                            uploadedLessonFileName={
                              lesson.uploaded_lesson_file_name
                            }
                            uploadedLessonFile={lesson.uploaded_lesson_file}
                            article={lesson.article}
                            published={lesson.published}
                            allowPreview={lesson.allow_preview}
                            onOpenModSelectVideo={onOpenModSelectVideo}
                            onOpenModUploadVideo={onOpenModUploadVideo}
                            onOpenModUploadFile={onOpenModUploadFile}
                            onOpenModSelectFile={onOpenModSelectFile}
                            onAddLesson={this.handleAddLesson}
                            onChange={onLessonDataChange}
                            onCancel={this.handleCancelLesson}
                            onDeleteLesson={this.handleDeleteLesson}
                            onEditLesson={this.handleEditLesson}
                            onSave={this.handleSaveLesson}
                          />
                        ))
                      ) : (
                        <Button
                          variant="outlined"
                          onClick={this.handleAddLesson}
                        >
                          New Lesson
                        </Button>
                      )}
                      {provided.placeholder}
                      <div className={classes.addButtonContainer}>
                        <button
                          className={classes.addIcon}
                          onClick={this.handleAddSection}
                        >
                          <AddIcon />
                        </button>
                      </div>
                    </div>
                  )}
                </Droppable>
              </React.Fragment>
            )}
          </div>
        )}
      </Draggable>
    );
  }
}

Section.propTypes = {
  classes: PropTypes.object,
  error: PropTypes.object,
  isEditing: PropTypes.bool,
  isCreated: PropTypes.bool,
  draggableId: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  published: PropTypes.bool,
  lessons: PropTypes.array,
  onAddNewSection: PropTypes.func,
  onEditSectionClick: PropTypes.func,
  onDeleteSectionClick: PropTypes.func,
  onSectionDataChange: PropTypes.func,
  onSaveSection: PropTypes.func,
  onCancelSection: PropTypes.func,

  onAddLesson: PropTypes.func,
  onLessonDataChange: PropTypes.func,
  onCancelLesson: PropTypes.func,
  onDeleteLesson: PropTypes.func,
  onEditLesson: PropTypes.func,
  onSaveLesson: PropTypes.func,
  onOpenModSelectVideo: PropTypes.func,
  onOpenModUploadVideo: PropTypes.func,
  onOpenModUploadFile: PropTypes.func,
  onOpenModSelectFile: PropTypes.func
};

export default compose(withStyles(styles, { withTheme: true }))(Section);
