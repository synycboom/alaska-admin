import React from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
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
import ReactHLS from '../../components/ReactHLS';
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

  componentDidMount() {
    this.loadData();
  }

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

  loadData = () => {
    Promise.all([
      this.languageService.listAllLanguages(),
      this.levelService.listAllLevels(),
      this.categoryService.listAllCategories(),
      this.userService.listAllInstructors(),
      this.subscriptionPlanService.listAllSubscriptionPlans(),
    ]).then(dataList => {
      this.setState({
        languages: dataList[0].results.map(item => ({ value: item.id, label: item.name })),
        levels: dataList[1].results.map(item => ({ value: item.id, label: item.name })),
        categories: dataList[2].results.map(item => ({ value: item.id, label: item.name })),
        instructors: dataList[3].results.map(item => ({ value: item.id, label: item.full_name })),
        allSubscriptionPlans: dataList[4].results.map(item => ({ value: item.id, label: item.name })),
      })
    }).catch(_ => this.props.enqueueSnackbar(
      'Something has gone wrong, please refresh.', 
      { variant: 'error' }
    ));
  };

  handleSave = () => {
    const data = { 
      title: this.state.title,
      headline: this.state.headline,
      description: this.state.description,
      published: this.state.published,
      uploaded_cover_image: this.state.uploadedCoverImageId,
      uploaded_trailer_video: this.state.uploadedTrailerVideoId,
      category: this.state.category && this.state.category.value,
      subcategory: this.state.subcategory && this.state.subcategory.value,
      language: this.state.language && this.state.language.value,
      level: this.state.level && this.state.level.value,
      instructor: this.state.instructor && this.state.instructor.value,
      subscription_plans: this.state.subscriptionPlans.map(item => item.value),
    };

    this.setState({error: {...this.initialError}, loading: true});
    this.courseService.createCourseLanding(data)
      .then(data => {
        this.props.enqueueSnackbar(data.detail, { variant: 'success' });
        this.props.onSaveSuccess();
      })
      .catch(this.catchError)
      .then(() => this.setState({ loading: false }));
  };

  handleEdit = () => {

  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleCategoryChange = (event) => {
    this.handleChange(event)
    this.categoryService.listSubCategories(event.target.value.value)
      .then(data => this.setState({
        subcategory: null,
        subcategories: data.results.map(item => ({ 
          value: item.id, 
          label: item.name 
        }))
      }))
      .catch(_ => this.props.enqueueSnackbar(
        'Something has gone wrong, please refresh.', 
        { variant: 'error' }
      ));
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
      .catch(_ => this.props.enqueueSnackbar(
        'Something has gone wrong, please refresh.', 
        { variant: 'error' }
      ));
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
      .catch(_ => this.props.enqueueSnackbar(
        'Something has gone wrong, please refresh.', 
        { variant: 'error' }
      ));
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
        uploadedTrailerVideoPreview: (
          data.encoded_videos.length > 0 
          ? data.encoded_videos[0].url 
          : null
        ),
      }))
      .catch(_ => this.props.enqueueSnackbar(
        'Something has gone wrong, please refresh.', 
        { variant: 'error' }
      ));
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
        openModSelectVideo: false,
        uploadedTrailerVideoName: data.name,
        uploadedTrailerVideoPreview: (
          data.encoded_videos.length > 0 
          ? data.encoded_videos[0].url 
          : null
        ),
      }))
      .catch(_ => this.props.enqueueSnackbar(
        'Something has gone wrong, please refresh.',
        { variant: 'error' }
      ));
  };
  

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

        <TextField
          fullWidth
          required
          autoFocus
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

        {/* THIS SHOULD BE DRAFT JS */}
        <TextField
          fullWidth
          label='Description'
          name='description'
          margin='normal'
          variant='filled'
          InputLabelProps={{
            shrink: true,
          }}
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
              alt='course image'
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
              <ReactHLS
                url={uploadedTrailerVideoPreview}
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
          onClick={mode === 'create' ? this.handleSave : this.handleEdit}
        >
          SAVE LANDING
        </LoadingButton>
      </form>
    );
  }
}

CourseLanding.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  onSaveSuccess: PropTypes.func,
};

CourseLanding.defaultProps = {
  onSaveSuccess: () => {},
};

export default compose(
  withStyles(styles, { withTheme: true }),
  withSnackbar,
)(CourseLanding);