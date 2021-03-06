import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { toReadableTime } from '../utils/time';
import ReactPlayer from 'react-player';
import { actions } from '../reducers/player';
import ProgressSeeker from '../components/ProgressSeeker';
import EpisodeDetail from '../components/EpisodeDetail';
import { StyleSheet, css } from 'aphrodite';
import ButtonRow from '../components/ButtonRow';
import PlayButton from '../components/PlayButton';
import VolumeControl from '../components/VolumeControl';
import FwdTenButton from '../components/FwdTenButton';
import BackTenButton from '../components/BackTenButton';

class Player extends Component {
  ref = (player) => {
    this.player = player;
  }

  forwardTen = () => {
    const newPosition = Math.min(this.player.getCurrentTime() + 10, this.player.getDuration());
    this.player.seekTo(newPosition);
  }

  backwardTen = () => {
    const newPosition = Math.max(this.player.getCurrentTime() - 10, 0);
    this.player.seekTo(newPosition);
  }

  toggleModal = () => {
    if(this.props.player.detailsVisible) {
      this.props.hideDetail()
    } else {
      this.props.showDetail()
    }
  }

  render() {
    const { url, playing, volume, muted, loop, played, playedSeconds, loaded, duration, playbackRate, trackMetadata } = this.props.player;

    if(loaded) {
        console.debug('Duration', duration);
    }

    const displayDuration = toReadableTime(duration * 1000);

    const detail = (
      <div>
        <h2 className={css(styles.detailHeader)}>
          <small>{trackMetadata.title}<br /></small>
          {trackMetadata.episode}
        </h2>
        <p>{trackMetadata.description}</p>
      </div>
    )

    return (
      <div>
        <div className={css(styles.footerPlayer, this.props.active && styles.footerPlayerActive)}>
          <ReactPlayer
            height='0'
            url={url}
            playing={playing}
            playbackRate={playbackRate}
            volume={volume}
            muted={muted}
            loop={loop}
            ref={this.ref}
            fileConfig={{
                forceAudio: true
            }}
            onProgress={(progress) => !this.props.player.seeking && this.props.updateProgress(progress)}
            onDuration={this.props.setDuration}
          />
          <div className={css(styles.meta)} onClick={this.toggleModal}>
            <img className={css(styles.artwork, this.props.player.detailsVisible && styles.largerArtwork)} src={trackMetadata.image_url}></img>
              <span className={css(styles.playerMeta, this.props.player.detailsVisible && styles.hiddenMeta)}>
                <small>{trackMetadata.title}<br /></small>
                {trackMetadata.episode}
              </span>
          </div>
          <div className={css(styles.controls)}>
            <ButtonRow>
              <BackTenButton onClick={this.backwardTen} style={{marginRight: 20}}/>
              <PlayButton playing={playing} touched={this.props.touched} onClick={() => this.props.setPlaying(!playing)} />
              <FwdTenButton onClick={this.forwardTen} style={{marginLeft: 20}}/>
            </ButtonRow>
            <div className={css(styles.progressContainer)}>
                <ProgressSeeker
                  max={1}
                  value={played}
                  knobShowing={true}
                  beforeValue={toReadableTime(duration * played)}
                  afterValue={toReadableTime(duration)}
                  onStartChange={() => this.props.setSeeking(true)}
                  onChange={(val) => this.props.setPosition(val)}
                  onCompleteChange={(val) => {
                    this.props.setSeeking(false);
                    this.player.seekTo(val);
                  }}
                />
            </div>
          </div>

          <div className={css(styles.volumeContainer)}>
            <VolumeControl
              volume={volume}
              muted={muted}
              onMuteToggle={() => this.props.setMuteValue(!muted)}
              onVolumeChange={(volume) => this.props.setVolume(volume)}
            />
          </div>
        </div>
        <EpisodeDetail active={this.props.player.detailsVisible}>
          {this.props.player.detailsVisible && detail}
        </EpisodeDetail>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  footerPlayer: {
    position: 'fixed',
    width: '100%',
    bottom: -100,
    left: 0,
    height: 100,
    padding: 20,
    backgroundColor: '#222',
    transition: '.2s',
    zIndex: 20
  },
  footerPlayerActive: {
    bottom: 0,
    boxShadow: '0 0 10px black'
  },
  controls: {
    width: '50%',
    float: 'left',
    margin: '0 auto',
    '@media (max-width: 768px)': {
      width: '100%',
    },
  },
  playPause: {
    backgroundColor: '#333',
    color: '#aaa',
    borderRadius: 15,
    outline: 'none'
  },
  fwdBack: {
    margin: '0 15px',
  },
  meta: {
    float: 'left',
    width: '25%',
    cursor: 'pointer',
    display: 'flex',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  playerMeta: {
    order: 1,
    paddingLeft: 10,
    transition: '.4s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxHeight: 56,
    '@media (max-width: 959px)': {
      display: 'none'
    }
  },
  hiddenMeta: {
    transform: 'translate(0, -100vh) scale(2, 2)',
    opacity: 0
  },
  artwork: {
    transform: 'scale(1, 1)',
    transformOrigin: 'bottom left',
    transition: '.2s',
    transitionDelay: '.1s',
    width: 56,
    height: 56,
    display: 'table-cell',
    order: 1
  },
  largerArtwork: {
    '@media (min-width: 720px)': {
      transform: 'translate(20px, -100px) scale(5.35, 5.35)',
    }
  },
  detailHeader: {
    marginTop: 0
  },
  progressContainer: {
    paddingTop: 16,
  },
  volumeContainer: {
    float: 'right',
    width: '15%',
    marginLeft: '10%',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
});

const mapStateToProps = (state) => {
  return {
    player: state.player,
    touched: state.behaviors.touched
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setMuteValue: (newMuteValue) => dispatch(actions.setMuteValue(newMuteValue)),
    setVolume: (volume) => dispatch(actions.setVolume(volume)),
    setPlaying: (isPlaying) => dispatch(actions.setPlaying(isPlaying)),
    updateProgress: (progress) => dispatch(actions.updateProgress(progress)),
    showDetail: () => dispatch(actions.showDetail()),
    hideDetail: () => dispatch(actions.hideDetail()),
    setDuration: (duration) => dispatch(actions.setDuration(duration)),
    setSeeking: (seeking) => dispatch(actions.setSeeking(seeking)),
    setPosition: (position) => dispatch(actions.setPosition(position)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
