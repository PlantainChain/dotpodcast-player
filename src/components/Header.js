import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, FormGroup, FormControl } from 'react-bootstrap';
import logo from '../images/web-logo-dark.png';
import { StyleSheet, css } from 'aphrodite';
import { actions } from '../reducers/search';
import {
  isUserSignedIn,
  signUserOut,
} from 'blockstack';

class Header extends Component {
  handleLogout() {
    signUserOut(`${window.location.origin}/login`)
  }
  
  handleLogin() {
    window.location = '/login';
  }

  render() {
    return (
      <Navbar className={css(styles.header)} fluid inverse fixedTop>
        <Navbar.Header>
          <Navbar.Brand className={css(styles.icon)}>
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          <Navbar.Form>
            <FormGroup>
              <FormControl
                className={css(styles.searchInput)}
                type="text"
                placeholder="Search"
                value={this.props.searchText}
                onInput={(evt) => this.props.updateSearch(evt.target.value)}
              />
            </FormGroup>
          </Navbar.Form>
        </Nav>
        <Navbar.Collapse>
          
          {this.props.isAuthenticated && <Nav>
            <NavItem><Link to="/" className={css(styles.link)}>Home</Link></NavItem>
          </Nav>}
          {this.props.isAuthenticated && <Nav>
            <NavItem onClick={this.handleLogout}>Log Out</NavItem>
          </Nav>}
          {!this.props.isAuthenticated && <Nav>
            <NavItem onClick={this.handleLogin}>Login</NavItem>
          </Nav>}
        </Navbar.Collapse>
      </Navbar>
    );
  }
};

const styles = StyleSheet.create({
  icon: {
    padding: 10
  },
  header: {
    borderBottom: 0,
    boxShadow: '0 0 10px black'
  },
  searchInput: {
    border: '1px solid #111',
    backgroundColor: '#262D30',
    color: '#ddd',
    borderRadius: 17,
    width: 180,
    transition: '.2s',
    ':focus': {
      border: 0,
      backgroundColor: '#EEE',
      color: '#111',
      width: 300,
    }
  },
  link: {"color":"#9d9d9d"}
});

const mapStateToProps = state => {
  return {
    searchText: state.search.text,
    isAuthenticated: !!state.user.publicKey && isUserSignedIn(),
  }
}
const mapDispatchToProps = dispatch => {
  return {
    updateSearch: (text) => dispatch(actions.updateQuery(text))
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Header);
