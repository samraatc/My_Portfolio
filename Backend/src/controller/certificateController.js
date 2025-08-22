import Certificate from '../models/Certificate.js';
import uploadOnCloudinary from '../utils/cloudinary.js'; // Adjust path as needed
import path from 'path';

export const createCertificate = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug log
    console.log("Received files:", req.files); // Debug log

    let imageLocalPath = null;

    if (req.files && req.files.image && req.files.image.length > 0) {
      imageLocalPath = req.files.image[0].path;
    }

    if (!imageLocalPath) {
      return res.status(400).send("Image file is required");
    }

    // Upload image to Cloudinary
    const imageUploadResult = await uploadOnCloudinary(imageLocalPath);

    if (!imageUploadResult) {
      return res.status(500).send("Failed to upload image to Cloudinary");
    }

    console.log("Cloudinary image URL:", imageUploadResult.secure_url);

    // Create new certificate with date conversions
    const newCertificate = new Certificate({
      name: req.body.name,
      description: req.body.description,
      session: {
        start: new Date(req.body.startDate),
        end: new Date(req.body.endDate),
      },
      organization: req.body.organization,
      issuedDate: req.body.issuedDate ? new Date(req.body.issuedDate) : undefined,
      image: imageUploadResult.secure_url,
    });

    await newCertificate.save();
    res.status(201).json(newCertificate);

  } catch (error) {
    console.error("Error creating certificate:", error);
    res.status(500).json({ error: 'Failed to create certificate' });
  }
};


export const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findByIdAndDelete(id);
    if (!certificate) return res.status(404).json({ error: 'Certificate not found' });

    res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
};


export const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    let imageUrl = req.body.image; // preserve existing image URL if no new image

    if (req.files && req.files.image && req.files.image.length > 0) {
      const filePath = req.files.image[0].path;
      const result = await uploadOnCloudinary(filePath);
      imageUrl = result ? result.secure_url : imageUrl;
    }

    // Convert date strings to Date objects if present
    const updatedData = {
      ...req.body,
      image: imageUrl,
      session: {
        start: new Date(req.body.startDate),
        end: new Date(req.body.endDate),
      },
      issuedDate: req.body.issuedDate ? new Date(req.body.issuedDate) : undefined,
    };

    const updatedCertificate = await Certificate.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedCertificate) return res.status(404).json({ error: 'Certificate not found' });

    res.status(200).json(updatedCertificate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update certificate' });
  }
};


export const getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findById(id);
    if (!certificate) return res.status(404).json({ error: 'Certificate not found' });

    res.status(200).json(certificate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get certificate' });
  }
};

export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find();
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching certificates', error: error.message });
  }
};
