import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import EpisodeList from '../containers/EpisodeList';
import SubscriptionChoice from '../containers/SubscriptionChoice';
import TipButton from '../components/TipButton';
import { StyleSheet, css } from 'aphrodite';

class PodcastDetail extends Component {
  renderTipLink() {
    let addresses = this.props.podcast.payment_addresses;
    if(addresses && Object.keys(addresses).length > 0) {
      return (
        <TipButton addresses={addresses} />
      )
    } else {
      return (<TipButton placeholder={true} podcastName={this.props.podcast.title} podcastEmail={this.props.podcast.author.email}/>)
    }
  }
  render() {
    const podcast = this.props.podcast;

    return (
      <Grid>
        <div className={css(styles.headerContainer)}>
          <div className={css(styles.imageContainer)}>
            <img className={css(styles.artwork)} src={podcast.artwork['@2x']} alt='Podcast artwork' />
          </div>
          <div className={css(styles.detailContainer)}>
            <div className={css(styles.title)}>{podcast.title}</div>
            <div className={css(styles.author)}>{podcast.author.name}</div>
            {this.renderTipLink(podcast.payment_addresses)}
            <p className={css(styles.description)}>{podcast.description_text}</p>
            <SubscriptionChoice podcast={podcast} />
          </div>
        </div>
        <EpisodeList podcast={podcast} />
      </Grid>
    )
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    marginBottom: 40,
    '@media (max-width: 768px)': {
      flexWrap: 'wrap',
    },
  },
  imageContainer: {
    width: 300,
    marginRight: 15,
    '@media (max-width: 768px)': {
      marginRight: 0,
      width: '100%',
    },
  },
  artwork: {
    width: '100%',
  },
  detailContainer: {
    marginLeft: 30,
    '@media (max-width: 768px)': {
      marginLeft: 0,
      marginTop: 20,
    },
  },
  title: {
    fontSize: 28,
  },
  author: {
    color: '#bbb',
    fontStyle: 'italic',
  },
  description: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default PodcastDetail;
