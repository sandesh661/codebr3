import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import _ from 'lodash';

class Categories extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			categories: [],
			sources: [],
			isActive: ''
		}
		this.handleActive = this.handleActive.bind(this);
	}
	
	componentWillMount(){
		axios.get('https://newsapi.org/v2/sources?apiKey=0a01fd51a20147fc92c78e89b6abf152')
		.then((response) => {
			const sources = response.data.sources;
			const result = _.uniq(_.map(sources, item => item.category));
			this.setState({categories:result});
			//console.log(result);
		})
	}
	handleActive(category){
		this.setState({ isActive : category, sources: ['Loading...'] });
		
		axios.get('https://newsapi.org/v2/top-headlines?country=de&category='+category+'&apiKey=0a01fd51a20147fc92c78e89b6abf152')
		.then((response) => {
			const articles = response.data.articles;
			const result = _.uniq(_.map(articles, item => item.source));
			const result2 = _.uniqWith(result, _.isEqual);
			//const removeNull = _.reject(result2, ['id', null]);						//Remove If news id:null 
			this.setState({sources:result2});
			console.log(response);
		})
	}
	
	render(){
		return( 
			<div>
				{this.state.categories.map( (catobj, i) => (
					<Category value={catobj} key={i} isactive={catobj === this.state.isActive} handleActivePrnt={this.handleActive} />
				))}
					<Sources sources={this.state.sources} />
			</div>
		)
	}
}

class Category extends React.Component{
	constructor(props){
		super(props);
		
		this.handleCatClick = this.handleCatClick.bind(this);
	}
	handleCatClick(event){
		this.props.handleActivePrnt(event.target.attributes.getNamedItem('data-cat').value);
	}
	
	render(){
		return(
			<div className={this.props.isactive ? 'cat-active' : 'category' } data-cat={this.props.value} onClick={this.handleCatClick}>{this.props.value}</div>
		);
	}
}

class Sources extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			news : []
		}
	}
	handleSourceSelect(event){
		var source_id = event.target.value;
		if(source_id===""){
			source_id = 'bbc-news';
		}
		axios.get('https://newsapi.org/v2/top-headlines?sources='+source_id+'&apiKey=0a01fd51a20147fc92c78e89b6abf152')
		.then((response) => {
			this.setState({news:response.data.articles});
			//console.log(response.data.articles);
		})
	}
	render(){
		return(
			<div>
				<select className="dropdown-btn" onChange={this.handleSourceSelect.bind(this)}>
				{ this.props.sources.map( (source, i) => (
						<option value={source.id} key={i}>{source.name}</option>
				))}
				</select>
				<div className="news_div">
					{ this.state.news.map( (newsobj, i) => (
					<div className="news">
							<img src={newsobj.urlToImage} className="img_resp" />
							<a href={newsobj.url} className="heading" key={i}>{newsobj.title}</a>
							<p className="description">{newsobj.content}<span className="readmore"><a href={newsobj.url} target="_blank">read more...</a></span></p>
					</div>
					))}
				</div>
			</div>
		);
	}
}

ReactDOM.render(<Categories />, document.getElementById('root'));
