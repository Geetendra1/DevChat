import React  from 'react';
import {Grid,Form,Segment,Button,Message,Icon,Header} from 'semantic-ui-react'
import {Link} from 'react-router-dom';
import firebase from '../../firebase';

class Login extends React.Component {

    state = {
        
        email:"",
        password: "",
        errors: [],
        loading: false,
    }

    displayErrors = errors => errors.map((error,i) => <p key={i}>{error.message}</p>)

    handleChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) { 
        this.setState({errors: [], loading: true})
        firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password)
          .then(signedInUser => {
            console.log(signedInUser);
          })
          .catch(err => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err),
              loading: false
            });
          })

        }
    }

    isFormValid = ({ email,password}) => email && password;



    handleInputError = (errors,inputName) => {
        return errors.some(error => 
            error.message.toLowerCase().includes(inputName)
            )
             ? 'error'
             : ''
    } 
    
  render() {
      const { email,loading, password,errors} = this.state
      
    return (
     <Grid textAlign="center" verticalAlign="middle" className="app">
         <Grid.Column style={{maxWidth:450}}>
             <Header as="h1" icon color="teal" textAlign="center">
                 <Icon name="code branch" color="teal"/>
                Login for DevChat
             </Header>
            <Form size="large" onSubmit={this.handleSubmit}>
                <Segment stacked>

                    <Form.Input fluid name="email" icon="mail" iconPosition="left" placeholder="Email Address" className={this.handleInputError(errors,'email')} onChange={this.handleChange} value={email} type="email" />

                    <Form.Input fluid name="password" icon="lock" iconPosition="left" placeholder="Password"  onChange={this.handleChange} value={password} type="password" className={this.handleInputError(errors,'password')} />

                    <Button disabled={loading} className={loading ? 'loading' : ''} color="teal" fluid size="large">Submit</Button>

                </Segment>
            </Form>
            {errors.length > 0 && (
                <Message error>
                    <h3>Error</h3>
                    {this.displayErrors(this.state.errors)}
                </Message>
            )}
            <Message>Dont have an account?<Link to="/register">Register</Link></Message>
         </Grid.Column>
     </Grid>
    );
  }
}
export default Login;