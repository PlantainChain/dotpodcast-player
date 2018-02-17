import React, { Component} from 'react';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { actions } from '../reducers/episode-list';
import { StyleSheet, css } from 'aphrodite';
import EpisodeRow from '../containers/EpisodeRow';

class EpisodeList extends Component {
  state = {}

  render() {
    if(this.props.error) {
      return (
        <Alert bsStyle="danger">{this.props.error.message}</Alert>
      )
    }

    if(this.props.episodes) {
      const renderedList = this.props.episodes.map(
        (episode) => (
          <EpisodeRow podcast={this.props.podcast} episode={episode} />
        )
      )

      return (
        <table className={css(styles.table)}>
          <thead>
            <tr>
              <th className={css(styles.header)}></th>
              <th className={css(styles.header)}>Title</th>
              <th className={css(styles.header)}>Release Date</th>
              <th className={css(styles.header)}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {renderedList}
          </tbody>
        </table>
      )
    }

    if(this.props.requesting) {
      return (<div>Loading episode list...</div>)
    }

    return (<div>Loading...</div>)
  }
};

const styles = StyleSheet.create({
  table: {
    width: '100%',
  },
  header: {
    paddingBottom: 7,
    color: '#bbb',
  },
});

const mapStateToProps = state => {
  return {
    episodes: state.episodeList.episodes,
    requesting: state.episodeList.requesting,
    podcast: state.podcastDetail.podcast,
    error: state.episodeList.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getList: (url) => {
      dispatch(actions.listRequested(url));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EpisodeList);
