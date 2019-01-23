import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import JSONPretty from 'react-json-pretty';
import Paper from '@material-ui/core/Paper';
import compose from 'recompose/compose';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import CourseService from '../../apis/CourseService'; 
import Section from './Section';
import LoadingButton from '../../components/LoadingButton';
import ModSelectVideo from '../uploaded-videos/ModSelectVideo';
import ModUploadVideo from '../uploaded-videos/ModUploadVideo';
import ModSelectFile from '../uploaded-files/ModSelectFile';
import ModUploadFile from '../uploaded-files/ModUploadFile';

import UploadedVideoService from '../../apis/UploadedVideoService';
import UploadedFileService from '../../apis/UploadedFileService';

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
    marginTop: '20px',
    width: '100%',
    height: '100%',
  },
  nonFieldError: {
    color: theme.palette.error.main,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  errorSection: {
    padding: '20px',
  }
});

const INITIAL_SECTION_ERROR = {
  title: '',
  description: '',
  non_field_errors: '',
  detail: '',
};

const INITIAL_LESSON_ERROR = {
  type: '',
  title: '',
  article: '',
  uploadedLessonVideo: '',
  uploadedLessonFile: '',
  published: '',
  non_field_errors: '',
  detail: '',
};

const INITIAL_ERROR = null;

class CourseCurriculum extends React.PureComponent {
  courseService = new CourseService();
  uploadedVideoService = new UploadedVideoService();
  uploadedFileService = new UploadedFileService();
  state = {
    loading: false,
    lessons: {
    },
    sections: {
    },
    sectionOrder: [],
    openModSelectVideo: false,
    openModUploadVideo: false,
    openModUploadFile: false,
    openModSelectFile: false,
    // For using in Modal
    currentSectionUUID: null,
    currentLessonUUID: null,
    error: INITIAL_ERROR,
  };

  onDragEnd = result => {
    const { destination, source, draggableId, type } = result;
    const { sectionOrder, sections } = this.state;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Move section
    if (type === 'SECTION') {
      const newSectionOrder = Array.from(sectionOrder);
      newSectionOrder.splice(source.index, 1);
      newSectionOrder.splice(destination.index, 0, draggableId);
  
      this.setState({ sectionOrder: [...newSectionOrder]});
    } else {
      // Move a lesson between the same list
      const start = sections[source.droppableId];
      const finish = sections[destination.droppableId];
      
      if (start === finish) {
        const newLessonUUIDs = Array.from(start.lessonUUIDs);
        newLessonUUIDs.splice(source.index, 1);
        newLessonUUIDs.splice(destination.index, 0, draggableId);
        
        const newSection = {
          ...start,
          lessonUUIDs: newLessonUUIDs,
        };
        
        this.setState({ sections: {
          ...this.state.sections,
          [newSection.uuid]: newSection,
        }});
        
      } else {
        // Move a lesson from one to another list
        const startLessonUUIDs = Array.from(start.lessonUUIDs);
        startLessonUUIDs.splice(source.index, 1);
        
        const newStart = {
          ...start,
          lessonUUIDs: startLessonUUIDs
        };
        
        const finishLessonUUIDs = Array.from(finish.lessonUUIDs);
        finishLessonUUIDs.splice(destination.index, 0, draggableId);
        const newFinish = {
          ...finish,
          lessonUUIDs: finishLessonUUIDs
        };
        
        this.setState({ sections: {
          ...this.state.sections,
          [newStart.uuid]: newStart,
          [newFinish.uuid]: newFinish,
        }});
      }
    }
  };

  handleAddNewSection = index => {
    const newId = uuidv4();
    const newState = {
      sections: {
        ...this.state.sections,
        [newId]: {
          uuid: newId,
          title: '',
          description: '',
          isEditing: true,
          isCreated: false,
          lessonUUIDs: [],
          published: false,
          error: {
           ...INITIAL_SECTION_ERROR 
          },
        },
      },
      sectionOrder: [...this.state.sectionOrder]
    };

    // Insert sectionId to sectionOrder
    if (!index) {
      newState.sectionOrder = [newId];
    } else {
      newState.sectionOrder.splice(index, 0, newId);
    }

    this.setState(newState);
  };

  handleSectionChange = (id, name, value) => {
    const section = this.state.sections[id];

    this.setState({
      sections: {
        ...this.state.sections,
        [id]: {
          ...section,
          [name]: value,
        }
      }
    });
  };

  handleEditSectionClick = (id) => {
    const section = this.state.sections[id];
    this.setState({
      sections: {
        ...this.state.sections,
        [id]: { ...section, isEditing: true }
      }
    });
  };

  handleDeleteSectionClick = (id) => {
    const sectionOrder = this.state.sectionOrder.filter(sectionId => sectionId !== id);
    const sections = { ...this.state.sections };
    // TODO: Check if we need to delete lessons?
    delete sections[id];

    this.setState({ sections, sectionOrder });
  };

  handleSectionCancel = id => {
    const section = this.state.sections[id];
    this.setState({
      sections: {
        ...this.state.sections,
        [id]: { ...section, isEditing: false }
      }
    });
  };

  handleSectionSave = id => {
    const section = this.state.sections[id];
    const index = this.state.sectionOrder.indexOf(id) + 1;
    const data = {
      uuid: id,
      title: section.title,
      sort_order: index,
      description: section.description,
      published: section.published,
    };

    this.courseService.validateSection(data)
      .then(_ => {
        this.clearErrorAndReset('sections', section)
      })
      .catch(this.catchError('sections', section));
  };

  // ------------------------------------------------------------------ LESSON

  handleAddLesson = (sectionId, index) => {
    const section = this.state.sections[sectionId];
    const newId = uuidv4();
    const newState = {
      lessons: {
        ...this.state.lessons,
        [newId]: {
          uuid: newId,
          type: null,
          title: '',
          article: null,
          uploadedLessonVideo: null,
          uploadedLessonFile: null,
          isEditing: true,
          isCreated: false,
          published: false,
          error: {
           ...INITIAL_LESSON_ERROR 
          },
        },
      },
      sections: {
        ...this.state.sections,
        [section.uuid]: {
          ...section,
          lessonUUIDs: [...section.lessonUUIDs]
        },
      },
    };

    // Insert sectionId to sectionOrder
    if (!index) {
      newState.sections[section.uuid].lessonUUIDs = [newId];
    } else {
      newState.sections[section.uuid].lessonUUIDs.splice(index, 0, newId);
    }

    this.setState(newState);
  };

  handleLessonDataChange = (lessonUUID, name, value) => {
    const lesson = this.state.lessons[lessonUUID];
    
    this.setState({
      lessons: {
        ...this.state.lessons,
        [lessonUUID]: {
          ...lesson,
          [name]: value,
        }
      }
    });
  };

  handleLessonCancel = (sectionUUID, lessonUUID)  => {
    const lesson = this.state.lessons[lessonUUID];
    
    this.setState({
      lessons: {
        ...this.state.lessons,
        [lessonUUID]: {
          ...lesson,
          isEditing: false,
        }
      }
    });
  };

  handleDeleteLesson = (sectionUUID, lessonUUID) => {
    const sections = this.state.sections;
    const section = sections[sectionUUID];
    const newSections = {
      ...sections,
      [sectionUUID]: {
        ...section,
        lessonUUIDs: section.lessonUUIDs.filter(id => id !== lessonUUID)
      }
    }
    const newLessons = { ...this.state.lessons };
    delete newLessons[sectionUUID];

    this.setState({ lessons: newLessons, sections: newSections });
  };

  handleEditLesson = (sectionUUID, lessonUUID) => {
    const lesson = this.state.lessons[lessonUUID];
    
    this.setState({
      lessons: {
        ...this.state.lessons,
        [lessonUUID]: {
          ...lesson,
          isEditing: true,
        }
      }
    });

  };

  handleLessonSave = (sectionUUID, lessonUUID) => {
    const { enqueueSnackbar } = this.props;
    const lesson = this.state.lessons[lessonUUID];
    const index = this.state.sections[sectionUUID].lessonUUIDs.indexOf(lesson.uuid) + 1;

    const data = {
      uuid: lesson.uuid,
      title: lesson.title,
      sort_order: index,
      published: lesson.published,
      type: lesson.type,
      uploaded_lesson_video: lesson.uploaded_lesson_video || null,
      uploaded_lesson_file: lesson.uploaded_lesson_file || null,
      article: lesson.article,
    };

    ;

    this.courseService.validateLesson(data)
      .then(_ => {
        this.clearErrorAndReset('lessons', lesson)
      })
      .catch(this.catchError('lessons', lesson));
  };

  handleOpenModSelectVideo = (currentLessonUUID) => {
    this.setState({ openModSelectVideo: true, currentLessonUUID });
  };
  
  handleOpenModUploadVideo = (currentLessonUUID) => {
    this.setState({ openModUploadVideo: true, currentLessonUUID });
  };

  handleOpenModUploadFile = (currentLessonUUID) => {
    this.setState({ openModUploadFile: true, currentLessonUUID });
  };

  handleOpenModSelectFile = (currentLessonUUID) => {
    this.setState({ openModSelectFile: true, currentLessonUUID });
  };

  handleModSelectVideoClose = _ => {
    this.setState({ openModSelectVideo: false, currentLessonUUID: null });
  };

  handleModUploadVideoClose = _ => {
    this.setState({ openModUploadVideo: false, currentLessonUUID: null });
  };

  handleModSelectFileClose = _ => {
    this.setState({ openModSelectFile: false, currentLessonUUID: null });
  };

  handleModUploadFileClose = _ => {
    this.setState({ openModUploadFile: false, currentLessonUUID: null });
  };

  handleVideoSelect = (id) => {
    this.uploadedVideoService.getUploadedVideo(id)
      .then(data => {
        this.handleLessonDataChange(this.state.currentLessonUUID, 'uploaded_lesson_video_name', data.name);
        this.handleLessonDataChange(this.state.currentLessonUUID, 'uploaded_lesson_video', id);
      })
      .catch(this.catchGeneralError)
      .then(_ => this.setState({
        currentLessonUUID: null,
        openModSelectVideo: false,
      }));
  };

  handleUploadVideoSuccess = (id) => {
    this.uploadedVideoService.getUploadedVideo(id)
      .then(data => {
        this.handleLessonDataChange(this.state.currentLessonUUID, 'uploaded_lesson_video_name', data.name);
        this.handleLessonDataChange(this.state.currentLessonUUID, 'uploaded_lesson_video', id);
      })
      .catch(this.catchGeneralError)
      .then(_ => this.setState({
        currentLessonUUID: null,
        openModUploadVideo: false,
      }));
  };

  handleFileSelect = (id) => {
    this.uploadedFileService.getUploadedFile(id)
      .then(data => {
        this.handleLessonDataChange(this.state.currentLessonUUID, 'uploaded_lesson_file_name', data.name);
        this.handleLessonDataChange(this.state.currentLessonUUID, 'uploaded_lesson_file', id);
      })
      .catch(this.catchGeneralError)
      .then(_ => this.setState({
        currentLessonUUID: null,
        openModSelectFile: false,
      }));
  };

  handleUploadFileSuccess = (id) => {
    this.uploadedFileService.getUploadedFile(id)
      .then(data => {
        this.handleLessonDataChange(this.state.currentLessonUUID, 'uploaded_lesson_file_name', data.name);
        this.handleLessonDataChange(this.state.currentLessonUUID, 'uploaded_lesson_file', id);
      })
      .catch(this.catchGeneralError)
      .then(_ => this.setState({
        currentLessonUUID: null,
        openModUploadFile: false,
      }));
  };

  handleSave = _ => {
    const { match: { params } } = this.props;
    const sections = this.getSectionsForSave();
    const data = { sections };

    this.fetchStart();

    this.courseService.createCurriculum(params.id, data)
      .then(data => {
        this.props.enqueueSnackbar(data.detail, { variant: 'success' });
        this.props.onSaveSuccess();
      })
      .catch(error => {
        this.setState({ error });
        this.props.enqueueSnackbar('The action was not success.', { variant: 'error' });
      })
      .then(this.fetchEnd);
  };

  refresh = _ => {
    const { match: { params } } = this.props;

    this.courseService.getCurriculum(params.id)
      .then(data => {
        const sections = data.sections;
        const sectionOrder = [];
        const state = {
          lessons: {},
          sections: {},
          sectionOrder: [],
        }
        for (const section of sections) {
          const lessons = section.lessons;

          state.sections[section.uuid] = {
            ...section,
            error: { ...INITIAL_SECTION_ERROR },
            lessonUUIDs: lessons.map(item => item.uuid),
            isEditing: false,
            isCreated: true,
          };
          
          for (const lesson of lessons) {
            state.lessons[lesson.uuid] = {
              ...lesson,
              error: { ...INITIAL_LESSON_ERROR },
              isEditing: false,
              isCreated: true,
            };
          }
          
          sectionOrder.push(section.uuid);
          delete state.sections[section.uuid].lessons;
        }

        state.sectionOrder = sectionOrder;
        this.setState(state);
      })
      .catch(error => this.setState({ error }))
      .then(this.fetchEnd);
  };

  fetchStart = _ => {
    this.setState({
      error: INITIAL_ERROR,
      loading: true
    });
  };

  fetchEnd = _ => {
    this.setState({ loading: false });
  };

  clearErrorAndReset = (type, sectionOrLesson) => {
    this.setState({
      [type]: {
        ...this.state[type],
        [sectionOrLesson.uuid]: { 
          ...sectionOrLesson, 
          isEditing: false,
          isCreated: true,
          error: {
            ...(type === 'sections' ? INITIAL_SECTION_ERROR : INITIAL_LESSON_ERROR) 
          },
        }
      }
    });
  };

  catchError = (type, sectionOrLesson) => error => {
    let newError = {};

    for (let key in error) {
      if (error.hasOwnProperty(key)) {
        newError[key] = error[key];
      }
    }

    this.setState({
      [type]: {
        ...this.state[type],
        [sectionOrLesson.uuid]: { ...sectionOrLesson, error: newError }
      }
    });

    this.props.enqueueSnackbar('The action was not success.', { variant: 'error' });
  };

  getSectionsForSave = _ => {
    const { sectionOrder, sections, lessons } = this.state;

    return sectionOrder.map(sectionUUID => {
      const section = sections[sectionUUID];

      if (!section.isCreated) {
        return null;
      }

      let derivedLessons = section.lessonUUIDs.map(lessonUUID => {
        const lesson = lessons[lessonUUID];

        if (!lesson.isCreated) {
          return null;
        }

        return {
          uuid: lesson.uuid,
          type: lesson.type,
          title: lesson.title,
          uploaded_lesson_video: lesson.uploaded_lesson_video || null,
          uploaded_lesson_file: lesson.uploaded_lesson_file || null,
          article: lesson.article,
          published: lesson.published,
        };
      });

      // Filter null lessons out!
      derivedLessons = derivedLessons.filter(lesson => !!lesson);

      return {
        uuid: section.uuid,
        title: section.title,
        description: section.description,
        published: section.published,
        lessons: [...derivedLessons],
      };
    }).filter(
      // Filter null sections out!
      section => !!section
    );
  };

  getDerivedSections = _ => {
    const { sectionOrder, sections, lessons } = this.state;

    return sectionOrder.map(sectionUUID => {
      const section = sections[sectionUUID];
      const derivedLessons = section.lessonUUIDs.map(lessonUUID => lessons[lessonUUID]);
      return { ...section, lessons: [...derivedLessons] };
    });
  };

  componentDidMount() {
    this.refresh();
  }

  render() {
    const { classes } = this.props;
    const { 
      loading, 
      openModSelectVideo, 
      openModUploadVideo, 
      openModUploadFile, 
      openModSelectFile,
      error,
    } = this.state;
    const derivedSections = this.getDerivedSections();

    return (
      <React.Fragment>
        <Paper>
          {error && (
            <div className={classes.errorSection}>
              <JSONPretty data={error} />
            </div>
          )}
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId='SECTION-DROP' type='SECTION'>
              {provided => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={classes.paper}
                >
                  {derivedSections.length ? derivedSections.map((section, index) => (
                    <Section
                      key={section.uuid}
                      draggableId={section.uuid}
                      index={index}
                      title={section.title}
                      isCreated={section.isCreated}
                      isEditing={section.isEditing}
                      description={section.description}
                      published={section.published}
                      lessons={section.lessons}
                      error={section.error}

                      // SECTION
                      onAddNewSection={this.handleAddNewSection}
                      onEditSectionClick={this.handleEditSectionClick}
                      onDeleteSectionClick={this.handleDeleteSectionClick}
                      onSectionDataChange={this.handleSectionChange}
                      onSaveSection={this.handleSectionSave}
                      onCancelSection={this.handleSectionCancel}
                      
                      // LESSON
                      onAddLesson={this.handleAddLesson}
                      onLessonDataChange={this.handleLessonDataChange}
                      onCancelLesson={this.handleLessonCancel}
                      onDeleteLesson={this.handleDeleteLesson}
                      onEditLesson={this.handleEditLesson}
                      onSaveLesson={this.handleLessonSave}
                      onOpenModSelectVideo={this.handleOpenModSelectVideo}
                      onOpenModUploadVideo={this.handleOpenModUploadVideo}
                      onOpenModUploadFile={this.handleOpenModUploadFile}
                      onOpenModSelectFile={this.handleOpenModSelectFile}
                    />
                  )) : (
                    <Button variant='outlined' onClick={this.handleAddNewSection}>
                      New Section
                    </Button>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Paper>

        <LoadingButton
          fullWidth
          variant='contained'
          color='primary'
          loading={loading}
          className={classes.submit}
          onClick={this.handleSave}
        >
          SAVE CURRICULUM
        </LoadingButton>

        <ModSelectVideo
          onClose={this.handleModSelectVideoClose}
          onSelect={this.handleVideoSelect}
          open={openModSelectVideo}
        />

        <ModUploadVideo
          onClose={this.handleModUploadVideoClose}
          onSaveSuccess={this.handleUploadVideoSuccess}
          open={openModUploadVideo}
        />

        <ModSelectFile
          onClose={this.handleModSelectFileClose}
          onSelect={this.handleFileSelect}
          open={openModSelectFile}
        />

        <ModUploadFile
          onClose={this.handleModUploadFileClose}
          onSaveSuccess={this.handleUploadFileSuccess}
          open={openModUploadFile}
        />

      </React.Fragment>
    );
  }
}

CourseCurriculum.propTypes = {
  onSaveSuccess: PropTypes.func,
};

CourseCurriculum.defaultProps = {
  onSaveSuccess: () => {},
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withRouter,
)(CourseCurriculum);