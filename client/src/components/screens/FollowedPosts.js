import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'

const FollowedPost = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)

    useEffect(() => {
        fetch('/getfollowedpost', {
            method: 'get',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(results => { 
                // console.log(results)
                setData(results.posts)
            }).catch(err => {
                console.log(err);
            })
    }, [])

    const likePost = (postId) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                postId,
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map((item) => {
                    if (item._id == result._id) {
                        return result;
                    } else {
                        return item;
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err);
            })
    }

    const unlikePost = (postId) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                postId,
            })
        }).then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map((item) => {
                    if (item._id == result._id) {
                        return result;
                    } else {
                        return item;
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                postId,
                text
            })
        })
            .then(res => res.json())
            .then(result => {
                // console.log(result)
                const newData = data.map((item) => {
                    if (item._id == result._id) {
                        return result;
                    } else {
                        return item;
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id;
                })
                setData(newData)
            }).catch(err => {
                console.log(err);
            })
    }

    // const deleteComment = (commentId, postId) => {
    //     console.log(commentId,postId)
    //     fetch(`/deletecomment/${commentId}/${postId}`, {
    //         method: "delete",
    //         headers: {
    //             "Authorization": "Bearer " + localStorage.getItem("jwt"),
    //         },
    //     }).then(res => res.json())
    //         .then(result => {
    //             console.log(result)
    //             const newData = data.map((item) => {
    //                 if (item._id == result._id) {
    //                     return result;
    //                 } else {
    //                     return item;
    //                 }
    //             })
    //             console.log(newData)
    //             setData(newData)
    //         }).catch(err => {
    //             console.log(err);
    //         })
    // }


    return (
        <div className="home">
            {
                data.map((item) => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{ padding: "5px" }}><Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"} > {item.postedBy.name}</Link> {item.postedBy._id === state._id
                                ? <i className="material-icons"
                                    style={{ float: "right" }}
                                    onClick={() => deletePost(item._id)}
                                >delete</i> : ""}
                            </h5>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id) ?
                                    <i className="material-icons" onClick={() => unlikePost(item._id)} style={{ color: "red" }}>favorite</i> :
                                    <i className="material-icons" onClick={() => likePost(item._id)}>favorite_border</i>}
                                <h6>{item.likes.length} likes</h6>
                                <h6 style={{ fontWeight: "1000" }}>{item.title} </h6>
                                <p style={{ fontWeight: "700" }}>{item.body}</p>
                                {
                                    item.comments.map((comment) => {
                                        return (
                                            <h6 key={comment._id}><span style={{ fontWeight: "500" }}>{comment.postedBy.name}</span> {comment.text}
                                                {comment.postedBy._id === state._id ?
                                                    <i className="material-icons"
                                                        style={{ float: "right" }}
                                                    >delete</i> : ""} </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type="text" placeholder="Add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default FollowedPost