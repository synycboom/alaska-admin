import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import ImageIcon from '@material-ui/icons/Image';
import VideocamIcon from '@material-ui/icons/Videocam';

import LanguageService from '../../apis/LanguageService';
import LevelService from '../../apis/LevelService';
import CategoryService from '../../apis/CategoryService';
import CourseService from '../../apis/CourseService';
import UserService from '../../apis/UserService';
import SubscriptionPlanService from '../../apis/SubscriptionPlanService';
import UploadedImageService from '../../apis/UploadedImageService';
import UploadedVideoService from '../../apis/UploadedVideoService';

import SelectInput from '../../components/SelectInput';
import LoadingButton from '../../components/LoadingButton';
import TextEditor from '../../components/TextEditor';
import ModSelectImage from '../uploaded-images/ModSelectImage';
import ModUploadImage from '../uploaded-images/ModUploadImage';
import ModSelectVideo from '../uploaded-videos/ModSelectVideo';
import ModUploadVideo from '../uploaded-videos/ModUploadVideo';

const styles = theme => ({
  otherError: {
    color: theme.palette.error.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
  iframeContainer: {
    background: 'black',
    '& iframe': {
      width: '100%',
    },
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class CourseLanding extends React.PureComponent {
  courseService = new CourseService();
  languageService = new LanguageService();
  levelService = new LevelService();
  categoryService = new CategoryService();
  userService = new UserService();
  subscriptionPlanService = new SubscriptionPlanService();
  uploadedImageService = new UploadedImageService();
  uploadedVideoService = new UploadedVideoService();
  initialError = {
    title: '',
    headline: '',
    description: '',
    published: '',
    uploaded_cover_image: '',
    uploaded_trailer_video: '',
    category: '',
    subcategory: '',
    language: '',
    level: '',
    instructor: '',
    subscription_plans: '',
    non_field_errors: '',
    detail: '',
  }
  state = {
    title: '',
    headline: '',
    description: '',
    published: false,
    uploadedCoverImagePreview: '',
    uploadedCoverImageName: '',
    uploadedCoverImageId: null,
    uploadedTrailerVideoPreview: '',
    uploadedTrailerVideoName: '',
    uploadedTrailerVideoId: null,
    category: null,
    categories: [],
    subcategory: null,
    subcategories: [],
    language: null,
    languages: [],
    level: null,
    levels: [],
    instructor: null,
    instructors: [],
    subscriptionPlans: [],
    allSubscriptionPlans: [],
    error: {...this.initialError},
    openModSelectImage: false,
    openModSelectVideo: false,
    openModUploadImage: false,
    openModUploadVideo: false,
  }

  handleSave = _ => {
    const { match: { params }, mode } = this.props;
    const data = this.populateSaveData();
    let promise = Promise.resolve();

    this.fetchStart();

    if (mode === 'create') {
      promise = this.courseService.createCourseLanding(data);
    } else {
      promise = this.courseService.updateCourseLanding(params.id, data);
    }
    
    promise.then(data => {
        this.props.enqueueSnackbar(data.detail, { variant: 'success' });
        this.props.onSaveSuccess();
      })
      .catch(this.catchError)
      .then(this.fetchEnd);
  };

  handleChange = (event, checked) => {
    this.setState({
      [event.target.name]: typeof checked === 'undefined' ? event.target.value : checked
    });
  };

  handleCategoryChange = (event) => {
    this.handleChange(event)
    this.categoryService.listSubCategories(event.target.value)
      .then(data => this.setState({
        subcategory: null,
        subcategories: data.results.map(item => ({
          value: item.id,
          label: item.name
        }))
      }))
      .catch(this.catchGeneralError);
  }

  // ------------------------------------------------------------------ ModSelectImage
  handleImageOpen = () => {
    this.setState({ openModSelectImage: true });
  };

  handleImageClose = () => {
    this.setState({ openModSelectImage: false });
  };

  handleImageSelect = (id) => {
    this.uploadedImageService.getUploadedImage(id)
      .then(data => this.setState({
        uploadedCoverImageId: id,
        openModSelectImage: false,
        uploadedCoverImagePreview: data.original_image,
        uploadedCoverImageName: data.name,
      }))
      .catch(this.catchGeneralError);
  };

  handleDiscardImage = () => {
    this.setState({
      uploadedCoverImageId: null,
      openModSelectImage: false,
      uploadedCoverImagePreview: '',
      uploadedCoverImageName: '',
    });
  }

  // ----------------------------------------------------------------- ModUploadImage
  handleUploadImageOpen = () => {
    this.setState({ openModUploadImage: true });
  };

  handleUploadImageClose = () => {
    this.setState({ openModUploadImage: false });
  };

  handleUploadImageSuccess = (id) => {
    this.uploadedImageService.getUploadedImage(id)
      .then(data => this.setState({
        uploadedCoverImageId: id,
        openModUploadImage: false,
        uploadedCoverImagePreview: data.original_image,
        uploadedCoverImageName: data.name,
      }))
      .catch(this.catchGeneralError);
  };

  // ----------------------------------------------------------------- ModSelectVideo
  handleVideoOpen = () => {
    this.setState({ openModSelectVideo: true });
  };

  handleVideoClose = () => {
    this.setState({ openModSelectVideo: false });
  };

  handleVideoSelect = (id) => {
    this.uploadedVideoService.getUploadedVideo(id)
      .then(data => this.setState({
        uploadedTrailerVideoId: id,
        openModSelectVideo: false,
        uploadedTrailerVideoName: data.name,
        uploadedTrailerVideoPreview: data.embedded_video,
      }))
      .catch(this.catchGeneralError);
  };

  handleDiscardVideo = () => {
    this.setState({
      uploadedTrailerVideoId: null,
      openModSelectVideo: false,
      uploadedTrailerVideoName: '',
      uploadedTrailerVideoPreview: null,
    });
  }

  // ----------------------------------------------------------------- ModUploadVideo
  handleUploadVideoOpen = () => {
    this.setState({ openModUploadVideo: true });
  };

  handleUploadVideoClose = () => {
    this.setState({ openModUploadVideo: false });
  };

  handleUploadVideoSuccess = (id) => {
    this.uploadedVideoService.getUploadedVideo(id)
      .then(data => this.setState({
        uploadedTrailerVideoId: id,
        openModUploadVideo: false,
        uploadedTrailerVideoName: data.name,
        uploadedTrailerVideoPreview: data.embedded_video,
      }))
      .catch(this.catchGeneralError);
  };

  // ------------------------------------------------------------------------------------ Utils
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

  catchGeneralError = _ => {
    this.props.enqueueSnackbar(
      'Something has gone wrong, please refresh.',
      { variant: 'error' }
    );
  };

  fetchStart = _ => {
    this.setState({
      error: {
        ...this.initialError
      },
      loading: true
    });
  };

  fetchEnd = _ => {
    this.setState({ loading: false });
  };

  populateSaveData = _ => {
    return {
      title: this.state.title,
      headline: this.state.headline,
      description: this.state.description,
      published: this.state.published,
      uploaded_cover_image: this.state.uploadedCoverImageId,
      uploaded_trailer_video: this.state.uploadedTrailerVideoId,
      category: this.state.category,
      subcategory: this.state.subcategory,
      language: this.state.language,
      level: this.state.level,
      instructor: this.state.instructor,
      subscription_plans: this.state.subscriptionPlans,
    };
  };

  refresh = _ => {
    const { match: { params }, mode } = this.props;
    let savedDataPromise = Promise.resolve(null);

    this.fetchStart();

    if (mode === 'update') {
      savedDataPromise = this.courseService.getCourseLanding(params.id);
    }

    const subCategoryPromise = savedDataPromise.then(data => {
      // the data will be null if mode is set to 'create'
      if (data) {
        this.setState({
          title: data.title,
          headline: data.headline,
          description: data.description,
          published: data.published,
          uploadedCoverImagePreview: data.uploaded_cover_image_preview,
          uploadedCoverImageName: data.uploaded_cover_image_name,
          uploadedCoverImageId: data.uploaded_cover_image,
          uploadedTrailerVideoPreview: data.uploaded_trailer_video_preview,
          uploadedTrailerVideoName: data.uploaded_trailer_video_name,
          uploadedTrailerVideoId: data.uploaded_trailer_video,
          category: data.category,
          subcategory: data.subcategory,
          language: data.language,
          level: data.level,
          instructor: data.instructor,
          subscriptionPlans: data.subscription_plans,
        });

        // Fetch subcategories from backend
        if (data.category) {
          return this.categoryService.listSubCategories(data.category);
        }
      }

      // Simulate subcategories data from backend
      return { results: [] };
    })

    Promise.all([
      this.languageService.listAllLanguages(),
      this.levelService.listAllLevels(),
      this.categoryService.listAllCategories(),
      this.userService.listAllInstructors(),
      this.subscriptionPlanService.listAllSubscriptionPlans(),
      subCategoryPromise,
    ])
      .then(dataList => {
        const languageData = dataList[0].results;
        const levelData = dataList[1].results;
        const categoryData = dataList[2].results;
        const instructorData = dataList[3].results;
        const allSubscriptionPlanData = dataList[4].results;
        const subcategoryData = dataList[5].results;
        const nextState = {
          languages: languageData.map(item => ({ value: item.id, label: item.name })),
          levels: levelData.map(item => ({ value: item.id, label: item.name })),
          categories: categoryData.map(item => ({ value: item.id, label: item.name })),
          instructors: instructorData.map(item => ({ value: item.id, label: item.full_name })),
          allSubscriptionPlans: allSubscriptionPlanData.map(item => ({ value: item.id, label: item.name })),
          subcategories: subcategoryData.map(item => ({ value: item.id, label: item.name })),
        };

        this.setState(nextState);
      })
      .catch(this.catchGeneralError)
      .then(this.fetchEnd);
  };

  componentDidMount() {
    this.refresh();
  }

  render() {
    const {
      classes,
      mode
    } = this.props;

    const {
      loading,
      error,
      title,
      headline,
      description,
      published,
      uploadedCoverImagePreview,
      uploadedCoverImageName,
      uploadedTrailerVideoPreview,
      uploadedTrailerVideoName,
      category,
      categories,
      subcategory,
      subcategories,
      language,
      languages,
      level,
      levels,
      instructor,
      instructors,
      subscriptionPlans,
      allSubscriptionPlans,
      openModSelectImage,
      openModSelectVideo,
      openModUploadImage,
      openModUploadVideo,
    } = this.state;

    return (
      <form className={classes.form}>
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
        
        <FormControlLabel
          label='Publish This Course'
          control={
            <Switch
              checked={published}
              onChange={this.handleChange}
              name='published'
              color='primary'
            />
          }
        />

        <TextField
          fullWidth
          required
          label='Title'
          name='title'
          margin='normal'
          variant='filled'
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
          required
          label='Headline'
          name='headline'
          margin='normal'
          variant='filled'
          InputLabelProps={{
            shrink: true,
          }}
          value={headline}
          onChange={this.handleChange}
          error={!!error.headline}
          helperText={error.headline}
        />

        <TextEditor
          label='Description'
          name='description'
          value={description}
          onChange={this.handleChange}
          error={!!error.description}
          helperText={error.description}
        />

        <SelectInput
          textFieldProps={{
            label: 'Language',
            variant: 'filled',
            margin: 'normal',
            error: !!error.language,
            helperText: error.language,
            InputLabelProps: {
              shrink: true,
            },
          }}
          name='language'
          value={language}
          options={languages}
          onChange={this.handleChange}
        />

        <SelectInput
          textFieldProps={{
            label: 'Level',
            variant: 'filled',
            margin: 'normal',
            error: !!error.level,
            helperText: error.level,
            InputLabelProps: {
              shrink: true,
            },
          }}
          name='level'
          value={level}
          options={levels}
          onChange={this.handleChange}
        />

        <SelectInput
          textFieldProps={{
            label: 'Category',
            variant: 'filled',
            margin: 'normal',
            error: !!error.category,
            helperText: error.category,
            InputLabelProps: {
              shrink: true,
            },
          }}
          name='category'
          value={category}
          options={categories}
          onChange={this.handleCategoryChange}
        />

        <SelectInput
          textFieldProps={{
            label: 'SubCategory',
            variant: 'filled',
            margin: 'normal',
            error: !!error.subcategory,
            helperText: error.subcategory,
            InputLabelProps: {
              shrink: true,
            },
          }}
          name='subcategory'
          value={subcategory}
          options={subcategories}
          onChange={this.handleChange}
        />

        <SelectInput
          textFieldProps={{
            label: 'Instructor',
            variant: 'filled',
            margin: 'normal',
            error: !!error.instructor,
            helperText: error.instructor,
            InputLabelProps: {
              shrink: true,
            },
          }}
          name='instructor'
          value={instructor}
          options={instructors}
          onChange={this.handleChange}
        />

        <SelectInput
          isMulti
          textFieldProps={{
            label: 'Subscription Plans',
            variant: 'filled',
            margin: 'normal',
            error: !!error.subscription_plans,
            helperText: error.subscription_plans,
            InputLabelProps: {
              shrink: true,
            },
          }}
          name='subscriptionPlans'
          value={subscriptionPlans}
          options={allSubscriptionPlans}
          onChange={this.handleChange}
        />

        <br />

        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
            <img
              alt='course'
              style={{width: '100%'}}
              src={uploadedCoverImagePreview
                ? uploadedCoverImagePreview
                : process.env.PUBLIC_URL + '/course_image.png'
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant='contained'
              color='secondary'
              className={classes.button}
              onClick={this.handleImageOpen}
            >
              Choose
              <FolderOpenIcon className={classes.rightIcon} />
            </Button>
            <Button
              variant='contained'
              color='default'
              className={classes.button}
              onClick={this.handleUploadImageOpen}
            >
              Upload
              <CloudUploadIcon className={classes.rightIcon} />
            </Button>

            {uploadedCoverImageName && (
              <Chip
                icon={<ImageIcon />}
                label={`File: ${uploadedCoverImageName}`}
                clickable
                color='primary'
                onDelete={this.handleDiscardImage}
              />
            )}

          </Grid>

          <Grid item xs={12} sm={6}>
            {uploadedTrailerVideoPreview ? (
              <div 
                className={classes.iframeContainer}
                dangerouslySetInnerHTML={{__html: uploadedTrailerVideoPreview}}
              />
            ) : (
              <img
                alt='course video'
                style={{width: '100%'}}
                src={process.env.PUBLIC_URL + '/course_video.png'}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant='contained'
              color='secondary'
              className={classes.button}
              onClick={this.handleVideoOpen}
            >
              Choose
              <FolderOpenIcon className={classes.rightIcon} />
            </Button>
            <Button
              variant='contained'
              color='default'
              className={classes.button}
              onClick={this.handleUploadVideoOpen}
            >
              Upload
              <CloudUploadIcon className={classes.rightIcon} />
            </Button>

            {uploadedTrailerVideoName && (
              <Chip
                icon={<VideocamIcon />}
                label={`File: ${uploadedTrailerVideoName}`}
                clickable
                color='primary'
                onDelete={this.handleDiscardVideo}
              />
            )}
          </Grid>
        </Grid>

        <ModSelectImage
          onClose={this.handleImageClose}
          onSelect={this.handleImageSelect}
          open={openModSelectImage}
        />

        <ModSelectVideo
          onClose={this.handleVideoClose}
          onSelect={this.handleVideoSelect}
          open={openModSelectVideo}
        />

        <ModUploadImage
          onClose={this.handleUploadImageClose}
          onSaveSuccess={this.handleUploadImageSuccess}
          open={openModUploadImage}
        />

        <ModUploadVideo
          onClose={this.handleUploadVideoClose}
          onSaveSuccess={this.handleUploadVideoSuccess}
          open={openModUploadVideo}
        />

        <LoadingButton
          fullWidth
          variant='contained'
          color='primary'
          loading={loading}
          className={classes.submit}
          onClick={this.handleSave}
        >
          {mode === 'create' ? 'SAVE LANDING' : 'UPDATE LANDING'}
        </LoadingButton>
      </form>
    );
  }
}

CourseLanding.propTypes = {
  mode: PropTypes.oneOf(['create', 'update']).isRequired,
  onSaveSuccess: PropTypes.func,
};

CourseLanding.defaultProps = {
  onSaveSuccess: () => {},
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
  withRouter,
)(CourseLanding);