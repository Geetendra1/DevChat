import React, { Component } from 'react';
import {Grid, Header,Icon, Dropdown,Image,Button, Input,Modal} from 'semantic-ui-react'
import firebase from '../../firebase';
import AvatarEditor from 'react-avatar-editor'
class UserPanel extends Component {
    state = {
        user:this.props.currentUser,
        Modal:false,
        previewImage:'',
        croppedImage: '',
        blob: '',
        uploadCroppedImage:'',
        storageRef: firebase.storage().ref(),
        userRef: firebase.auth().currentUser,
        usersRef: firebase.database().ref('users'),
        metadata: {
            contentType: 'image/jpeg'
        }
    }

    openModal = () => this.setState({modal:true})

    closeModal = () => this.setState({modal:false})

    handleChange = event => {
        const file = event.target.files[0];
        const reader = new FileReader();

        if (file) {
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                this.setState({previewImage: reader.result})
            })
        }
    }

    dropDownOptions = () => [
        {
            key:"user",
        text:<span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        },
        {
            key:"avatar",
            text: <span onClick={this.openModal}>Change Avatar</span>
        },
        {
            key:"signout",
            text: <span onClick={this.handleSignout}>Sign out</span>
        }
    ]
    
    handleSignout = () => {
        firebase 
            .auth()
            .signOut()
            .then(() => console.log("signed out"))
    }
    
    handleCropImage = () => {
        if(this.AvatarEditor) {
            this.AvatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);
                this.setState({
                    croppedImage: imageUrl,
                    blob
                })
            })
        }
    }

    uploadCroppedImage = () => {
        const {storageRef, userRef, blob, metadata} = this.state;
        storageRef
            .child(`avatar/user.${userRef.uid}`)
            .put(blob,metadata)
            .then(snap => {
                snap.ref.getDownloadURL().then(downloadURL => {
                    this.setState({uploadCroppedImage: downloadURL}, () =>
                    this.changeAvatar())
                })
            })
    }

    changeAvatar = () => {
        this.state.userRef
            .updateProfile({
                photoURL:this.state.uploadCroppedImage
            })
            .then(()=> {
                console.log('photoUrl updated');
                this.closeModal();
            })
            .catch(err => {
                console.error(err)
            })

        this.state.usersRef
            .child(this.state.user.uid)
            .update({avatar:this.state.uploadCroppedImage})
            .then(() => {
                console.log('User avatar updated');
            })
            .catch(err => {
                console.log(err)
            })
    }
  render() {
      const {user, modal, previewImage, croppedImage} = this.state;
      const {primaryColor } = this.props
    return (
     <Grid style={{background:primaryColor}}>
         <Grid.Column>
             <Grid.Row style={{padding:'1.2rem', margin:0}}>
                <Header inverted floated="left" as="h2">
                    <Icon name="code"/>
                    <Header.Content>
                        DevChat
                    </Header.Content>
                </Header>
             <Header style={{padding:'0.25rem'}} as="h4" inverted>
                 <Dropdown trigger={
                 <span>
                     <Image src={user.photoURL} spaced="right" avatar/>
                     {user.displayName}</span>
                 } options={this.dropDownOptions()}/>
             </Header>
             </Grid.Row>
             <Modal basic open={modal} onClose={this.closeModal}>
                 <Modal.Header>Change Avatar</Modal.Header>
                 <Modal.Content>
                     <Input
                     onChange={this.handleChange}
                     fluid 
                     type="file"
                     label="new avatar"
                     name="previewImage"
                     />
                     <Grid centered stackable columns={2}>
                         <Grid.Row centered>
                            <Grid.Column className="ui center aligned grid">
                                {previewImage && (
                                    <AvatarEditor
                                        ref={node => (this.AvatarEditor = node)}
                                        image={previewImage}
                                        width={120}
                                        height={120}
                                        border={50}
                                        scale={1.2}
                                    />
                                )}
                            </Grid.Column>
                            <Grid.Column>
                                    {croppedImage && (
                                        <Image
                                        style={{margin:'3.5em auto'}}
                                        width={100}
                                        height={100}
                                        src={croppedImage}
                                        />
                                    )}
                            </Grid.Column>
                         </Grid.Row>

                     </Grid>
                 </Modal.Content>
                 <Modal.Actions>
                    {croppedImage && <Button color="green" inverted onClick={this.uploadCroppedImage}>
                        <Icon name="save"/> Change Avatar
                    </Button>}
                    <Button color="green" inverted onClick={this.handleCropImage}>
                        <Icon name="image"/> preview Avatar
                    </Button>
                    <Button color="red" inverted onClick={this.closeModal}>
                        <Icon name="remove"/>Cancel
                    </Button>
                 </Modal.Actions>
             </Modal>
         </Grid.Column>
     </Grid>
    );
  }
}



export default UserPanel