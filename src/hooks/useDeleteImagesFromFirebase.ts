import { storage } from "@/firebase/BaseConfig";
import { ref, deleteObject } from "firebase/storage";

const useDeleteImagesFromFirebase = () => {
  const handleDelete = (urls: string[]) => {
    urls.forEach(async (url) => {
      const httpsReference = ref(storage, url);

      await deleteObject(httpsReference);
    });
  };

  return { handleDelete };
};

export default useDeleteImagesFromFirebase;
