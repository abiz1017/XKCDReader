import React from 'react';
import {Button, Container, Form, Row, ButtonToolbar, Col} from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';
import {FaHeart, FaStar} from 'react-icons/fa';
import $ from 'jquery';


class App extends React.Component{
    constructor(props) {
        super(props);
        this.state ={ 
            imglink:"",
            caption:"",
            currComic: Math.floor(Math.random() * (1000 - 1 + 1)) + 1,
            countHeart: 0,
            heartArr: [],
            starArry:[],
            rhymeSearch:[],
            star: false
            
        }
        this.handleChange = this.handleChange.bind(this);
        this.specificComic = this.specificComic.bind(this);
      }
    handleChange(event){
        console.log(event.target.value);
        this.setState({currComic: event.target.value});
        console.log(this.state.currComic);
    }
    async fetchComic(url){

        let json = await fetch(url).then(res => res.json());
        const string = JSON.stringify(json);
        const count = (string.match(/\bcat\b|\bkitten\b|\bdog\b/gi ) || []).length;
        this.setState({countHeart: count});
        const setStar = (string.match(/\bstar\b/gi) || []).length;
        if (setStar > 0){
            this.setState({star: true, starArry: []});
            this.state.starArry.push(<FaStar key={1}></FaStar>);
            console.log('found Star');
        }
        let i;
        this.setState({heartArr: []});
        for (i = 0; i < count; i++){
            console.log("adding heart");
            this.state.heartArr.push(<FaHeart key={i}></FaHeart>);
        }
        const rhymes = (string.match(/\w{11}/gi) || []);
        if (rhymes.length > 0){
                rhymes.forEach(async word => {
                    let res = await fetch(`http://localhost:9000/rhyme/${word}`);
                    let resjson = await res.json();
                    if (resjson.length > 0){
                        resjson.forEach(o => {
                            console.log(o.word);
                            this.state.rhymeSearch.push(<text>{o.word}</text>);
                        })
                    }
                     
                    
                });
            
        }
        console.log(this.state.countHeart);
        return json;

    }
    async prevComic(){
       await this.fetchComic(`http://localhost:9000/comic/${this.state.currComic - 1}`).then(
           res => {
               console.log(res);
               this.updateState(-1, res.img, res.transcript);
           }
       )
       console.log(this.state);
    }
    async nextComic(){
        await this.fetchComic(`http://localhost:9000/comic/${this.state.currComic + 1}`).then(
            res => {
                console.log(res);
                this.updateState(1, res.img, res.transcript);
            }
        )
        console.log(this.state);
     }
    async specificComic(){
        await this.fetchComic(`http://localhost:9000/comic/${this.state.currComic}`).then(
            res => {
                console.log(res);
                this.updateState(this.state.currComic, res.img, res.transcript);
            }
        )
        console.log(this.state); 
    }
    updateState(increment, link, transcript){
        this.setState({
            currComic: this.state.currComic + increment,
            imglink: link,
            caption: transcript
        })
    }
    componentDidMount(){
        this.fetchComic(`http://localhost:9000/comic/${this.state.currComic}`)
            .then(res =>{
                console.log(res);
                this.setState({imglink: res.img, caption: res.transcript})
            });

    }
    
    
    render(){
        var imgStyle = {alignItems: "center", paddingTop: 10, width: "100%" };
        var contStyle = {alignItems: "center", };
        return (
            <Container style={contStyle}>
            <ButtonToolbar> 
            <Col>

            <Button   onClick={() => this.prevComic()}>
                Previous
            </Button> 
            </Col>
            
           <Col>
           <Button onClick={() => this.nextComic()}>
                Next
            </Button>
           </Col>
            
            </ButtonToolbar>

            <Row style={imgStyle}>
                <Col>
                
                <img  alt="empty" src={this.state.imglink}>
                </img>
                </Col>
            </Row>
            <Row>
                <text>
                    {this.state.caption}
                </text>
            </Row>
            <Row style={imgStyle}>
                <Col>
                    <form onSubmit={() => this.specificComic(this.state.currComic)}>
                    <label>
                    Comic
                    <input type="number" id="currComic" onChange={this.handleChange} />
                    </label>
                    </form>
                    <Button onClick={this.specificComic}>Get Comic</Button>
                </Col>
            </Row>
            
            <Row> 
                <div>
                {this.state.heartArr}
            </div>
            <div id="star">
                {this.state.starArry}
            </div>
            <div>
                {this.state.rhymeSearch}
            </div>
            </Row>
            </Container>
            
        );
    }
}
export default App;
