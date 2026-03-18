// frontend/src/app.jsx
import React from 'react';
import ContentCreator from './components/ContentCreator';
import FeedPost from './components/FeedPost';

function App() {
    return (
        <div className="app-container">
            <main className="app-main">
                <ContentCreator />
                <FeedPost />
            </main>
        </div>
    );
};

export default App;