import React from 'react';
import PropTypes from 'prop-types';
import { getUrlParameter } from '../utils/url';


class ReactHls extends React.Component {
  constructor(props) {
    super(props);
    this.hls = null;
  }

  componentDidUpdate() {
    this._initPlayer();
  }

  componentDidMount() {
    this._initPlayer();
  }

  componentWillUnmount() {
    let { hls } = this;

    if (hls) {
      hls.destroy();
    }
  }

  _initPlayer() {
    if (this.hls) {
      this.hls.destroy();
    }

    const { url, autoplay, hlsConfig } = this.props;
    const policy = getUrlParameter(url, 'Policy');
    const signature = getUrlParameter(url, 'Signature');
    const keyPairId = getUrlParameter(url, 'Key-Pair-Id');
    const params = `?Policy=${policy}&Signature=${signature}&Key-Pair-Id=${keyPairId}`;

    const hls = new window.Hls({
      debug: true,
      xhrSetup: function (xhr, url) {
        xhr.open('GET', url + params, true);
      }
    });

    hls.loadSource(url);
    hls.attachMedia(this.player);
    hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
      if (autoplay) {
        this.player.play();
      }
    });

    this.hls = hls;
  }

  render() {
    const { controls, width, height, poster, videoProps } = this.props;

    return (
      <video
        ref={player => (this.player = player)}
        controls={controls}
        width={width}
        height={height}
        poster={poster}
        {...videoProps}
      />
    )
  }
}

ReactHls.propTypes = {
  url: PropTypes.string.isRequired,
  autoplay: PropTypes.bool,
  hlsConfig: PropTypes.object,
  controls: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  poster: PropTypes.string,
  videoProps: PropTypes.object
}

ReactHls.defaultProps = {
  autoplay: false,
  hlsConfig: {},
  controls: true,
  width: '80%',
  // height: 375
}

export default ReactHls;
