"use client";

import { storage } from "@/firebase";
import { toast } from "@/hooks/use-toast";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";


import { Progress } from "@/components/ui/progress"
import { UploadButton } from "@/utils/uploadthing";


import 'video.js/dist/video-js.css';
import videojs from 'video.js';

import ReactPlayer from 'react-player';
import { Loader2 } from "lucide-react";

// import shaka from 'shaka-player';


const page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [cloudinaryLoading, setCloudinaryLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");
  const [formData, setFormData] = useState<any>({
    video: null,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files);
      setFile(event.target.files[0]);

      setFormData({
        ...formData,
        video: event.target.files[0],
      })
      setFileType(event.target.files[0].type);
      setFileName(event.target.files[0].name);
    }
  };

  console.log(formData)


  const handleCloudinaryUpload = async (e: any) => {
    e.preventDefault();
    // const formData = new FormData();
    // formData.append('video', e.target.video.files[0]);


    setCloudinaryLoading(true);

    try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        if (response.ok) {
          setDownloadURL(data.url);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error uploading video:', error);
      } finally {
        setCloudinaryLoading(false);
      }
  }

  const handleUpload = async (e: any) => {
    e.preventDefault();

    setFileLoading(true);

    if (!file) {
      toast({
        title: "No file selected",
      });
      setFileLoading(false);
      return;
    }

    const fileRef = ref(storage, `videos/${file.name}`);

    // const metadata = {
    //     contentType: "video/mp4",
    // };

    try {
        await uploadBytes(fileRef, file);

        const url = await getDownloadURL(fileRef);
        setDownloadURL(url);
        setFileLoading(false);
          toast({
            className: "bg-yellow-600 text-white border-none",
            title: "File is uploaded",
          });
        console.log(downloadURL);
        setFileLoading(false);

    } catch (error) {
        console.error("Error", error);
        toast({
            variant: "destructive",
            title: `${error}`,
        })
        setFileLoading(false);
    }

    // const uploadTask = uploadBytesResumable(fileRef, file);

    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     const progress =
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     setUploadProgress(progress);
    //   },
    //   (error) => {
    //     console.error("Error uploading", error);
    //   },
    //   () => {
    //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //       setDownloadURL(downloadURL);
    //       setFileLoading(false);
    //       toast({
    //         className: "bg-yellow-600 text-white border-none",
    //         title: "File is uploaded",
    //       });
    //     });
    //     console.log(downloadURL);
    //   }

    
  };


//   const videoRef = useRef(null);

//   useEffect(() => {
//     const player = new shaka.Player(videoRef.current);

//     player.load(downloadURL).catch((error : any) => console.error('Error loading video:', error));

//     return () => player.destroy();
//   }, [downloadURL]);
  

  return (
    <div>
      <div className="bg-red-100">
        <form onSubmit={handleCloudinaryUpload} className="">
        <input type="file" name="video" accept="video/*" onChange={handleFileChange} />

        <button type="submit" disabled={cloudinaryLoading}>
          {cloudinaryLoading ? 'Uploading...' : 'Upload Video to Cloudinary'}
        </button>

        </form>



        <input type="file" accept="video/*" onChange={handleFileChange} />
        <button onClick={handleUpload}>
            {fileLoading ? <Loader2 className="animate-spin" /> :  "Upload Video"}
        </button>
        <Progress value={uploadProgress} />

        <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res : any) => {
          // Do something with the response
          console.log("Files: ", res);
          setDownloadURL(res?.url)
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />

      </div>

      <div className="">
        <Link href={downloadURL}>Download</Link>

        <pre>{JSON.stringify(downloadURL)}</pre>

        <video controls>
      <source src={downloadURL} type="video/mp4" />
      Your browser does not support the video tag.
    </video>

        <ReactPlayer url={downloadURL} controls={true} width="100%" height="100%" />

        {/* <video ref={videoRef} controls style={{ width: '100%' }} /> */}

        

      </div>
    </div>
  );
};

export default page;
