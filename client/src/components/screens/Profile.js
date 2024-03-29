import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'

const Profile = () => {
    const [mypics, setPics] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [image, setImage] = useState("")
    useEffect(() => {
        fetch("/mypost", {
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(results => {
                // console.log(results)
                setPics(results.mypost)
            })
    }, [])
    useEffect(() => {
        if(image){
        const data = new FormData()
        data.append("file", image);
        data.append("upload_preset", "Sociobox")
        data.append("cloud_name", "ab17best")
        fetch("https://api.cloudinary.com/v1_1/ab17best/image/upload", {
            method: "post",
            body: data,
        }).then(res => res.json())
            .then(data => {
                // console.log(data)
                fetch("/updatepic",{
                    method:"put",
                    headers:{
                        "Authorization": "Bearer " + localStorage.getItem("jwt"),
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    // console.log(result)
                    localStorage.setItem("user", JSON.stringify({
                            ...state,
                            pic: result.pic
                        }))
                    dispatch({ type: "UPDATEPIC", payload: result.pic })
                })
            })
            .catch(err => {
                console.log(err);
            })
        }
    }, [image])
    return (
        <>
            <div style={{ maxWidth: "550px", margin: "0px auto" }}>
                <div style={{
                    margin: "18px 0px",
                    borderBottom: "1px solid grey"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                    }}>

                        <div>
                            <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                src={state ? state.pic : "loading..."}
                            />
                        </div>

                        <div>
                            <h4>{state ? state.name : "loading..."} </h4>
                            <h5>{state ? state.email : "loading..."} </h5>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "108%"
                            }}>
                                <h6>{mypics.length} posts</h6>
                                <h6>{state ? state.followers.length : 0} followers</h6>
                                <h6>{state ? state.following.length : 0} following</h6>
                            </div>
                        </div>
                    </div>
                    <div className="file-field input-field" style={{ margin: "10px" }}>
                        <div className="btn">
                            <span>Update Profile Photo</span>
                            <input type="file" onChange={(e) => { setImage(e.target.files[0]) }} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                </div>
                <div className="gallery">
                    {
                        mypics.map((pic) => {
                            return (
                                <img key={pic._id} className="item" src={pic.photo} alt={pic.title} />
                            )
                        })
                    }
                </div>
            </div>
        
        </>
    )
}

export default Profile