"use client";

import { storage } from "@/firebase";
import { toast } from "@/hooks/use-toast";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";


import { Progress } from "@/components/ui/progress"
import { UploadButton } from "@/utils/uploadthing";


import 'video.js/dist/video-js.css';
import videojs from 'video.js';

import ReactPlayer from 'react-player';
import { Loader2 } from "lucide-react";
import { error } from "console";


const page = () => {

    const [files, setFiles] = useState<File | null | any>({});
    const [imagesUrl, setImagesUrl] = useState([]);
    const [imageUploadError, setImageUploadError] = useState<boolean | string>(false);


      const [fileType, setFileType] = useState("");
      const [fileName, setFileName] = useState("");
      const [fileLoading, setFileLoading] = useState(false);
      const [cloudinaryLoading, setCloudinaryLoading] = useState(false);
      const [uploadProgress, setUploadProgress] = useState(0);
      const [downloadURL, setDownloadURL] = useState("");
      const [formData, setFormData] = useState<any>({
        filesUrl: [],
      });

      const handleImageSubmit = (e: any) => {
        e.preventDefault();

        setFileLoading(true);

        if (files.length > 0) {
            const promises = [];

            for (let i=0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls: any) => {
                setFormData({
                    ...formData,
                    filesUrl: formData.filesUrl.concat(urls)
                })
                setImageUploadError(false)
                setFileLoading(false)
            }).catch((error) => {
                setImageUploadError("2mb max")
                setFileLoading(false)
            })
        } else {
            setImageUploadError("Only 6 images allowed")
            setFileLoading(false);
        }

        setFiles([]);
      };

      const storeImage = async (file : any) => {
        return new Promise((resolve, reject) => {
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, `files/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
                    resolve(downloadURL))
                }
            )
            setUploadProgress(0);
        })
      }

      console.log(formData)

  return (
    <div>
      <input type="file" multiple
      onChange={(e) => setFiles(e.target.files)} />
              <button onClick={handleImageSubmit} type="button">
                  {fileLoading ? <Loader2 className="animate-spin" /> :  "Upload Files"}
              </button>

              <Progress value={uploadProgress} />



              <div className="">
        
        <div className="">
            {formData.filesUrl.map((file: any, index: number) => (
                <div className="" key={index}>
                    <Link href={file}>Download</Link>
                </div>
            ))}
        </div>

        

      </div>
    </div>
  )
}

export default page
