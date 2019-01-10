import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import DehazeIcon from '@material-ui/icons/Dehaze';
import AddIcon from '@material-ui/icons/Add';
import Lesson from './Lesson';

const styles = theme => ({
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    backgroundColor: '#f2f2f5',
    border: 'solid 1px grey',
    marginBottom: '10px',
    position: 'relative',
  },
  header: {
    display: 'flex',
    marginBottom: '10px',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    '&:hover $hoverContainer': {
      visibility: 'visible',
    },
  },
  hoverContainer: {
    display: 'flex',
    visibility: 'hidden',
    flexGrow: 1,
  },
  sectionName: {
    marginRight: '5px',
  },
  headerIcon: {
    cursor: 'pointer',
    marginLeft: '5px',
    marginRight: '5px',
  },
  droppableArea: {
    minHeight: '25px',
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
  savePanel: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: '5px',
  }
});


const SectionHeader = ({classes, index, title, description, published , onEditClick, onDeleteClick}) => (
  <div className={classes.header}>
    <span>Section {index}: </span>
    <span className={classes.sectionName}>&nbsp;{title}</span>
    <div className={classes.hoverContainer}>
      <EditIcon className={classes.headerIcon} fontSize='small' onClick={onEditClick}/>
      <DeleteForeverIcon className={classes.headerIcon} fontSize='small' onClick={onDeleteClick}/>
      <div style={{flexGrow: 1}} />
      <DehazeIcon fontSize='small'/>
    </div>
  </div>
);

class Section extends React.PureComponent {
  state = {

  };

  handleChange = (event, checked) => {
    this.props.onSectionDataChange(
      this.props.draggableId,
      event.target.name,
      checked || event.target.value
    );
  };

  handleEditClick = _ => {
    this.props.onEditSectionClick(this.props.draggableId);
  };

  handleDeleteClick = _ => {
    this.props.onDeleteSectionClick(this.props.draggableId);
  };

  handleCancel = _ => {
    this.props.onCancelSection(this.props.draggableId);
  };

  handleSave = _ => {
    this.props.onSaveSection(this.props.draggableId);
  };

  handleAddSection = _ => {
    this.props.onAddNewSection(this.props.index + 1);
  };

  // ----------------------------------------------------------------- LESSON
  handleAddNewLesson = index => {
    this.props.onAddNewLesson(this.props.draggableId, index)
  };

  handleCancelLesson = lessonUUID => {
    this.props.onCancelLesson(this.props.draggableId, lessonUUID);
  }

  handleSaveLesson = lessonUUID => {
    this.props.onSaveLesson(this.props.draggableId, lessonUUID);
  }

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
      error,

      onLessonDataChange,
    } = this.props;

    console.log(lessons)

    return (
      <Draggable
        type='SECTION'
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
                <TextField
                  fullWidth
                  label='What will students be able to do at the end of this section?'
                  name='description'
                  variant='outlined'
                  margin='normal'
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={description}
                  onChange={this.handleChange}
                  error={!!error.description}
                  helperText={error.description}
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
                    Save Section
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
                <Droppable droppableId={draggableId} type='LESSON'>
                  {provided => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={classes.droppableArea}
                    >
                      {lessons.length ? lessons.map((lesson, index) => (
                        <Lesson
                          key={lesson.uuid}
                          draggableId={lesson.uuid}
                          index={index}
                          isEditing={lesson.isEditing}
                          error={lesson.error}
                          type={lesson.type}
                          title={lesson.title}
                          uploadedLessonVideo={lesson.uploaded_lesson_video_preview}
                          uploadedLessonFile={lesson.uploaded_lesson_file_preview}
                          article={lesson.article}
                          published={lesson.published}
                          onChange={onLessonDataChange}
                          onCancel={this.handleCancelLesson}
                          onSave={this.handleSaveLesson}
                        />
                      )) : (
                        <Button variant='outlined' onClick={this.handleAddNewLesson}>
                          New Lesson
                        </Button>
                      )}
                      {provided.placeholder}
                      <div className={classes.addButtonContainer}>
                        <button className={classes.addIcon} onClick={this.handleAddSection}>
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

  onAddNewLesson: PropTypes.func,
  onLessonDataChange: PropTypes.func,
  onCancelLesson: PropTypes.func,
  onSaveLesson: PropTypes.func,
};

export default compose(
  withStyles(styles, { withTheme: true }),
)(Section);