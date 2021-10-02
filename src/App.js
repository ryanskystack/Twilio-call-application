import React, { useState } from 'react';
import axios from "axios";

const App = () => {
  const [phone, setPhone] = useState('');
  const [questions, setQuestions] = useState([{ id: 1, content: '' }]);
  const [response, setResponse] = useState('');
  console.log('questions:', questions);

  const phoneChangeHandler = (event) => {
    setPhone(event.target.value);
  };

  const questionChangeHandler = (event) => {
    let i = parseInt(event.target.name);
    console.log('i:', i);
    let newQuestions = questions.concat();
    newQuestions[i].content = event.target.value;
    console.log('changed questions:', newQuestions);
    setQuestions(newQuestions);

  };

  const addHandler = (event) => {
    console.log('pre questions:', questions);
    // if (questions[0].content === '') {
    //   alert('Please at least input one question.');
    // } else {
    console.log('event.target:', event.target);

    let length = questions.length;
    let newQuestions = questions.concat({ id: length + 1, content: '' });
    console.log('new questions:', newQuestions);
    setQuestions(newQuestions);
    // }

  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (questions.length === 0) {
      alert('Please at least input one question.')
    };
    if (phone === '') {
      alert('Please input one mobile number.')
    };
    let request = { phoneNumber: phone };
    for (let i = 0; i < questions.length; i++) {
      request[i + 1] = questions[i].content;
    };
    console.log("request:", request);
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    axios.post('https://triggertwilio.azurewebsites.net/api/triggertwilio', request)
      .then(res => {
        console.log(res);
        console.log(res.data);
        let response = res.data;
        setResponse(response);
        // window.location = "/submitted" //This line of code will redirect you once the submission is succeed
      })
  };
  
  return (
    response  ===''
      ?
      (
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <form>
                <p>Welcome to Twilio Call App</p>
                <div>
                  <p>Enter your mobile phone number e.g.+458694753:</p>
                  <input
                    type='text'
                    value={phone}
                    placeholder="Enter phone"
                    onChange={phoneChangeHandler} />
                </div>
                <p>Enter your question, click Add button to add more questions: </p>
                {questions.map((question, index) => {
                  return (
                    <div key={question.id}>
                      <input
                        type='text'
                        name={index}
                        key={`input${question.id}`}
                        placeholder="Enter question"
                        // ref={inputRefs.current[index]}
                        value={question['content']}
                        onChange={questionChangeHandler}
                      />
                    </div>
                  )
                })}
                <button
                  className="btn btn-default"
                  type='button'
                  onClick={addHandler}
                >Add</button>
                <button
                  className="btn btn-default"
                  key="submit"
                  onClick={handleFormSubmit}
                >Submit</button>
              </form>
            </div>
          </div>
        </div>
      )
      :
      (
        < div >
          <p>{response}</p>
        </div >
      )
  );
}


export default App;



