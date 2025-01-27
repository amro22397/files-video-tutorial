"use client";

import { storage } from "@/firebase";
import { toast } from "@/hooks/use-toast";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";


import { Progress } from "@/components/ui/progress"


import 'video.js/dist/video-js.css';
import videojs from 'video.js';

import ReactPlayer from 'react-player';


const page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0]);
      setFile(event.target.files[0]);

      setFileType(event.target.files[0].type);
      setFileName(event.target.files[0].name);
    }
  };

  const handleUpload = (e: any) => {
    e.preventDefault();

    setFileLoading(true);

    if (!file) {
      toast({
        title: "No file selected",
      });
      setFileLoading(false);
      return;
    }

    const fileRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setDownloadURL(downloadURL);
          setFileLoading(false);
          toast({
            className: "bg-yellow-600 text-white border-none",
            title: "File is uploaded",
          });
        });
        console.log(downloadURL);
      }

      
    );
  };
  

  return (
    <div>
      <div className="">
        <input type="file" accept="video/*" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        <Progress value={uploadProgress} />
      </div>

      <div className="">
        <Link href={downloadURL}>Download</Link>

        <ReactPlayer url={downloadURL} controls={true} width="100%" height="100%" />

      </div>
    </div>
  );
};

export default page;
