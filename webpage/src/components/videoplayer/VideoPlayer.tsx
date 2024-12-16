import Peer from "peerjs";
import { useEffect } from "react"
import "./VideoPlayer.css"


interface VideoPlayerProps{
    me: Peer
    peeruuid: string;
    setCallStreamRecorder(callStreamRecord: MediaRecorder): any;
}

export const VideoPlayer = (props: VideoPlayerProps) =>{

    //const [callPerformed, setCallPerformed] = useState<boolean>(false)
/*
    const [me, setMe] = useState<Peer>(new Peer(props.uuid, 
        {config: {'iceServers': [
            { url: 'stun:stun.l.google.com:19302' },
            
          ]}
        }
    ));*/   

    useEffect(() =>{
        performCall()
        
    }, [props.peeruuid, props.me])


     const performCall = async () =>{
            //connect to peer
            console.log("performCall")

            const me = props.me;
            console.log(`me: ${me.id}, peer: ${props.peeruuid}`)

            //let conn = me.connect(props.peeruuid, {reliable: true})
            
            /*
            const connectToPeer = async () =>{

                console.log("connect to peer")
                try{
                let conn = me.connect(props.peeruuid, {reliable: true});
                if(!conn){
                    console.log("no connection")
                }
                console.log(me.id)
                
                    conn.on('open', function(){
                        console.log("sending")
                        //conn.send("hi!")
                    })
                }catch{
                    console.log("can't send to peer")
                }
                
                try{
                    me.on('connection', function(conn) {
                        conn.on('data', function(data){
                          // Will print 'hi!'
                          console.log(data);
                        });
                      });
                }catch{
                    console.log("can't receive to peer")
                }
                
            }
            
            await connectToPeer()*/
            
            console.log("me:" + me.id + "peer:" + props.peeruuid)
            const callstream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
            const answerstream = navigator.mediaDevices.getUserMedia({video: true, audio: false});
            /*
            const callStreamRecord = new MediaRecorder(callstream);
            console.log(props.setCallStreamRecorder)
            props.setCallStreamRecorder(callStreamRecord)*/
        
            (document.querySelector("#video1") as HTMLVideoElement).srcObject = callstream;
            const callpeer = async () =>{
                    
                //(document.querySelector("#video-client1") as HTMLVideoElement).srcObject = stream
                const call = me.call(props.peeruuid as string, callstream)
                call.on('stream', (remoteStream: MediaStream) => {
                    new MediaRecorder(remoteStream)
                    console.log("stream");
                    //(document.querySelector("#video1") as HTMLVideoElement).srcObject = callstream;
                    (document.querySelector("#video2") as HTMLVideoElement).srcObject = remoteStream;
                    //setCallPerformed(true)
                })
            }
            callpeer();
            
            const answerpeer = async () =>{
                    
                me.on('call', (call) => {
                    answerstream.then((stream) =>{
                        call.answer(stream)
                        call.on("stream", (remoteStream) =>{
                            //(document.querySelector("#video1") as HTMLVideoElement).srcObject = callstream;
                            (document.querySelector("#video2") as HTMLVideoElement).srcObject = remoteStream;
                            //setCallPerformed(true)
                        })
                    })
                })
            }
            answerpeer();
            
            
            /*
            while(!callPerformed){
                
            }*/
            
        }
    return(
        <>
            <div id="video-player">
                <video autoPlay={true} playsInline id="video1" className="displaymedia" />
                <video autoPlay={true} playsInline id="video2"className="displaymedia" />
            </div>
        </>
    );
}