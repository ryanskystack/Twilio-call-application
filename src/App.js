import React, { Component } from 'react';
import Checkbox from './component/Checkbox';
import axios from "axios";

const items = [
  'Are you an Australian Citizen?',
  'Do you hold the correct work rights or visa for this role?',
  'Tell me about a time you went above and beyond your work scope to achieve success.',
  'Describe your greatest strengths and weaknesses.',
  'What applicable skills, knowledge and experience can you bring to this position?',
  'Tell me about a time you had to work with a coworker who was difficult to work with.',
  '​What are your motivations in applying for this position within our organisation?',
  '​Tell me a little bit about yourself.',
  'At times you will be asked to work across many tasks at once, How do you prioritise your workload?',
  'What do you know about our company?',
  'What are your long term career goals over the next 5 years?',
  'Tell me about a time you made a mistake and did not deliver to expectations. What was the situation and what did you learn?'
];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      response: '',
      questions: {}
    };
  }

  UNSAFE_componentWillMount = () => {
    this.selectedCheckboxes = new Set();
  }

  toggleCheckbox = label => {
    if (this.selectedCheckboxes.has(label)) {
      this.selectedCheckboxes.delete(label);
    } else {
      this.selectedCheckboxes.add(label);
    }
  }

  myChangeHandler = (event) => {
    this.setState({ phoneNumber: event.target.value, response: '', questions: {}, });
  }
  handleFormSubmit = formSubmitEvent => {
    formSubmitEvent.preventDefault();
    const newState = Object.assign({}, this.state);
    console.log('')
    const questions = [];

    for (const element of this.selectedCheckboxes) {
      console.log('element', element);
      questions.push(element);
    };

    console.log('questions:', questions);
    for (let index = 0; index < questions.length; index++) {
      newState['questions'][index + 1] = questions[index];
    }
    console.log('newState:', newState);

    this.setState(newState);


    if (this.selectedCheckboxes.size === 0) {
      alert('Please at least select one question.')
    }

    if (this.state.phoneNumber === '') {
      alert('Please input one mobile number.')
    }
    let request = { phoneNumber: this.state.phoneNumber };
    console.log("Object.values(this.state.questions):", Object.values(this.state.questions))
    let questionArr = Object.values(this.state.questions);
    for (let i = 0; i < questionArr.length; i++) {
      request[i + 1] = questionArr[i];
    };

    console.log('request:', request);

    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    // axios.post(
    //   'https://triggertwilio.azurewebsites.net/api/triggertwilio',
    //   // { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   // {'Access-Control-Allow-Origin':'*'},
    //   // {'withCredentials': false},
    //   { questions },
    // )
    axios.post('https://triggertwilio.azurewebsites.net/api/triggertwilio', request)
      .then(res => {
        console.log(res);
        console.log(res.data);
        let response = { response: res.data }
        this.setState(response);
        // window.location = "/submitted" //This line of code will redirect you once the submission is succeed
      })
  }

  createCheckbox = label => (
    <Checkbox
      label={label}
      handleCheckboxChange={this.toggleCheckbox}
      key={label}
    />
  )

  createCheckboxes = () => (
    items.map(this.createCheckbox)
  )

  render() {
    return (
      this.state.response === ""
        ?
        (
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <form onSubmit={this.handleFormSubmit}>
                  <p>Welcome to Twilio Call App</p>
                  <p>Choose the questions:</p>
                  {this.createCheckboxes()}
                  <div>
                    <p>Enter your mobile phone number e.g.+458694753:</p>
                    <input
                      type='text'
                      value={this.state.phoneNumber}
                      onChange={this.myChangeHandler} />
                  </div>
                  <button className="btn btn-default" type="submit">Submit</button>
                </form>
              </div>
            </div>
          </div>
        )
        :
        (
          < div >
            <p>{this.state.response}</p>
          </div >
        )
    );
  }
}

export default App;
