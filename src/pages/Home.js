import React, {useContext, useEffect} from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition, Icon } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';

import MenuBar from '../components/MenuBar';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';

import imageAll from '../images/all2.png';
import image1b from '../images/112.svg';
import image2b from '../images/111.svg';
import image3b from '../images/110.svg';
import image4b from '../images/109.svg';
import image5b from '../images/108.svg';

function Home(props) {
    useEffect(() => {
        if(!user) {
            props.history.push('/login')
        }
    },[])
    
    const { user } = useContext(AuthContext);

    const {
        loading,
        data: { getPosts: posts } = {}
    } = useQuery(FETCH_POSTS_QUERY);

    return (
        <>
        <MenuBar />

        <div className="homeBackground" style={{position: 'fixed !important'}}>
            <img alt="" src={imageAll}/>
            <img alt="" src={image1b} className="image1b"/>
            <img alt="" src={image2b} className="image2b"/>
            <img alt="" src={image3b} className="image3b"/>
            <img alt="" src={image4b} className="image4b"/>
            <img alt="" src={image5b} className="image5b"/>
        </div>

        <h1 className="socialeyesTitle">Socialeyes</h1>
        <Grid columns={3}>
            <Grid.Row className="page-title">
                {/* <h1>Socialeyes</h1> */}
                <h2></h2>
            </Grid.Row>
            <Grid.Row centered>
                {user && (<PostForm/>)}
            </Grid.Row>
            {/* <Grid.Row> */}
                {loading ? 
                (
                    <>
                    <Grid.Row centered style={{marginTop: '50px'}}>
                        <Icon className="circle notch big loading icon" style={{fontSize: '75px', opacity: '.5'}}/>
                    </Grid.Row>
                    <Grid.Row centered>
                        <h1 style={{opacity: '.5'}}>loading moments...</h1>
                    </Grid.Row>
                    </>
                ) : (
                    <Transition.Group>
                        {
                            posts && posts.map(post => (
                                <Grid.Row key={post.id} style={{ marginBottom: '20px' }}>
                                    <PostCard post={post} />
                                </Grid.Row>
                            ))
                        }
                    </Transition.Group>
                )}
            {/* </Grid.Row> */}
        </Grid>
        </>
    );
}

export default Home;
