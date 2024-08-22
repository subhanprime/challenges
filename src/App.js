import logo from './logo.svg';
import './App.css';
import NewsFeed from './components/newsFeed';
import PersonalizedFeed from './components/PersonalizedFeed';
function App() {
  return (
    <div className="App">
      <h1>News Aggregator</h1>
      <NewsFeed />
      <PersonalizedFeed />
    </div>
  );
}

export default App;
