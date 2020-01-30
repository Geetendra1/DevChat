import React from 'react';
import {Grid} from 'semantic-ui-react';
import './App.css';
import ColorPanel from './ColorPanel/ColorPanel'
import Messages from './Messages/Messages'
import MetaPanel from './MetaPanel/MetaPanel'
import SidePanel from './SidePanel/SidePanel'
import {connect} from 'react-redux'

const App = ({currentUser, currentChannel,userPosts,isPrivateChannel}) => (
  <Grid columns="equal" className="app" style={{background: '#eee'}}>
    <ColorPanel/>

    <SidePanel 
    key={currentUser && currentUser.id}
    currentUser={currentUser} />
    <Grid.Column style={{marginLeft:320}}>

      
      <Messages 
      key={currentChannel && currentChannel.id}
      currentChannel={currentChannel}
      currentUser = {currentUser}
      isPrivateChannel={isPrivateChannel}
      />

      
    </Grid.Column>

    <Grid.Column width={4}>
      <MetaPanel
      key={currentChannel && currentChannel.id}
      isPrivateChannel={isPrivateChannel}
      currentChannel={currentChannel}
      userPosts={userPosts}
      />
    </Grid.Column>
  </Grid>
)

const mapStateToProps = state => ({
  currentUser : state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts:state.channel.userPosts
})


export default connect(mapStateToProps)(App);
