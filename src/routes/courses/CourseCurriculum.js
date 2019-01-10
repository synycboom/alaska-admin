import React from 'react';
import uuidv4 from 'uuid/v4';
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

// const initialData = {
//   lessons: {
//     'lesson-1': { 
//       id: 'lesson-1', 
//       title: 'lesson-1' 
//       isSave: true,
//     },
//     'lesson-2': { 
//       id: 'lesson-2', 
//       title: 'lesson-2' 
//       isSave: true,
//     },
//     'lesson-3': { 
//       id: 'lesson-3', 
//       title: 'lesson-3' 
//       isSave: true,
//     },
//   },
//   sections: {
//     'section-1': {
//       id: 'section-1',
//       name: 'section-1',
//       isSave: true,
//       lessonUUIDs: ['lesson-1', 'lesson-2']
//     },
//     'section-2': {
//       id: 'section-2',
//       name: 'section-2',
//       isSave: true,
//       lessonUUIDs: ['lesson-3']
//     },
//   },
//   sectionOrder: ['section-1', 'section-2']
// };

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

class CourseCurriculum extends React.PureComponent {
  courseService = new CourseService();
  state = {
    loading: false,
    lessons: {
    },
    sections: {
    },
    sectionOrder: [],
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
    this.handleSectionCancel(id);
  };

  handleSectionCancel = id => {
    const sectionOrder = this.state.sectionOrder.filter(sectionId => sectionId !== id);
    const sections = { ...this.state.sections };
    // TODO: Check if we need to delete lessons?
    delete sections[id];

    this.setState({ sections, sectionOrder });
  };

  handleSectionSave = id => {
    const { enqueueSnackbar } = this.props;
    const section = this.state.sections[id];
    const index = this.state.sectionOrder.indexOf(id) + 1;
    const data = {
      uuid: id,
      title: section.title,
      sort_order: index,
      description: section.description,
      published: section.published,
    };

    // Clear error on this section
    this.setState({
      sections: {
        ...this.state.sections,
        [id]: { ...section, error: { ...INITIAL_SECTION_ERROR } }
      }
    });

    this.courseService.validateSection(data)
      .then(data => {
        // Set isEditing to false
        this.setState({
          sections: {
            ...this.state.sections,
            [id]: { ...section, isEditing: false }
          }
        });
      })
      .catch(error => {
        let newError = {};

        for (let key in error) {
          if (error.hasOwnProperty(key)) {
            newError[key] = error[key];
          }
        }

        // Set error to this section
        this.setState({
          sections: {
            ...this.state.sections,
            [id]: { ...section, error: newError }
          }
        });

        enqueueSnackbar('The action was not success.', { variant: 'error' });
      });
  };

  // ------------------------------------------------------------------ LESSON

  handleAddNewLesson = (sectionId, index) => {
    const section = this.state.sections[sectionId];
    const newId = uuidv4();
    const newState = {
      lessons: {
        ...this.state.lessons,
        [newId]: {
          uuid: newId,
          type: null,
          title: '',
          article: '',
          uploadedLessonVideo: null,
          uploadedLessonFile: null,
          isEditing: true,
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

  handleLessonDataChange = (id, name, value) => {
    const lesson = this.state.lessons[id];

    this.setState({
      lessons: {
        ...this.state.lessons,
        [id]: {
          ...lesson,
          [name]: value,
        }
      }
    });
  };

  handleLessonCancel = (sectionUUID, lessonUUID)  => {
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

  handleLessonSave = id => {
    const { enqueueSnackbar } = this.props;
    const section = this.state.sections[id];
    const index = this.state.sectionOrder.indexOf(id) + 1;
    const data = {
      uuid: id,
      title: section.title,
      sort_order: index,
      description: section.description,
      published: section.published,
    };

    // Clear error on this section
    this.setState({
      sections: {
        ...this.state.sections,
        [id]: { ...section, error: { ...INITIAL_SECTION_ERROR } }
      }
    });

    this.courseService.validateLesson(data)
      .then(data => {
        // Set isEditing to false
        this.setState({
          sections: {
            ...this.state.sections,
            [id]: { ...section, isEditing: false }
          }
        });
      })
      .catch(error => {
        let newError = {};

        for (let key in error) {
          if (error.hasOwnProperty(key)) {
            newError[key] = error[key];
          }
        }

        // Set error to this section
        this.setState({
          sections: {
            ...this.state.sections,
            [id]: { ...section, error: newError }
          }
        });

        enqueueSnackbar('The action was not success.', { variant: 'error' });
      });
  };

  handleSave = _ => {
    const { match: { params } } = this.props;
    const derivedSections = this.getSectionsForSave();
    console.log(derivedSections)
  };

  catchError = error => {
    let newError = {};

    for (let key in error) {
      if (error.hasOwnProperty(key)) {
        newError[key] = error[key];
      }
    }

    this.props.enqueueSnackbar('The action was not success.', { variant: 'error' });
    this.setState({error: newError});
  };

  getSectionsForSave = _ => {
    const { sectionOrder, sections, lessons } = this.state;

    return sectionOrder.map((sectionUUID, index) => {
      const section = sections[sectionUUID];

      if (section.isEditing) {
        return null;
      }

      let derivedLessons = section.lessonUUIDs.map((lessonUUID, index) => {
        const lesson = lessons[lessonUUID];

        if (lesson.isEditing) {
          return null;
        }

        return {
          id: lesson.id,
          uuid: lesson.uuid,
          section_uuid: section.uuid,
          type: lesson.type,
          title: lesson.title,
          uploaded_video_cover_image: lesson.uploadedVideoCoverImage,
          uploaded_lesson_video: lesson.uploadedLessonVideo,
          uploaded_lesson_file: lesson.uploadedLessonFile,
          article: lesson.article,
          published: lesson.published,
          sort_order: index + 1,
        };
      });

      // Filter null lessons out!
      derivedLessons = derivedLessons.filter(lesson => !!lesson);

      return {
        id: section.id,
        uuid: section.uuid,
        title: section.title,
        description: section.description,
        published: section.published,
        sort_order: index + 1,
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

  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    const derivedSections = this.getDerivedSections();

    return (
      <React.Fragment>
        <Paper>
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
                      onAddNewLesson={this.handleAddNewLesson}
                      onLessonDataChange={this.handleLessonDataChange}
                      onCancelLesson={this.handleLessonCancel}
                      onSaveLesson={this.handleLessonSave}
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
      </React.Fragment>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withRouter,
)(CourseCurriculum);