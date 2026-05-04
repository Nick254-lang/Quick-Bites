'use client';

import { useRef, useState, type FormEvent, type JSX } from 'react';
import type { MenuCategory } from '@/lib/types';

const CATEGORIES: MenuCategory[] = [
  'signature',
  'grill',
  'bowls',
  'sides',
  'dessert',
  'drinks',
];

interface SignaturePayload {
  timestamp: number;
  signature: string;
  folder: string;
  cloudName: string;
  apiKey: string;
}

export default function CloudinaryMenuUploader(): JSX.Element {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<MenuCategory>('signature');
  const [prepTime, setPrepTime] = useState('15 min');
  const [calories, setCalories] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('signature');
    setPrepTime('15 min');
    setCalories('');
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setStatus('');

    if (!file) {
      setError('Please select an image file before uploading.');
      return;
    }

    if (!name.trim() || !description.trim() || !price.trim() || !prepTime.trim()) {
      setError('Please complete all menu fields before uploading.');
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      setError('Enter a valid price greater than zero.');
      return;
    }

    let numericCalories: number | undefined;
    if (calories.trim()) {
      numericCalories = Number(calories);
      if (Number.isNaN(numericCalories) || numericCalories <= 0) {
        setError('Enter a valid calorie count greater than zero.');
        return;
      }
    }

    setUploading(true);
    setStatus('Requesting Cloudinary signature...');

    try {
      const signatureResponse = await fetch('/api/uploads/signature', {
        method: 'POST',
      });

      if (!signatureResponse.ok) {
        throw new Error('Unable to get Cloudinary upload signature.');
      }

      const signaturePayload = (await signatureResponse.json()) as SignaturePayload;
      setStatus('Uploading image to Cloudinary...');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signaturePayload.apiKey);
      formData.append('timestamp', String(signaturePayload.timestamp));
      formData.append('signature', signaturePayload.signature);
      formData.append('folder', signaturePayload.folder);

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) {
        const errorBody = await cloudinaryResponse.text();
        throw new Error(`Cloudinary upload failed: ${errorBody}`);
      }

      const cloudinaryResult = await cloudinaryResponse.json();
      const imagePublicId = cloudinaryResult.public_id as string;

      if (!imagePublicId) {
        throw new Error('Cloudinary did not return a valid public ID.');
      }

      setStatus('Saving menu item...');
      const menuResponse = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          price: numericPrice,
          category,
          prepTime: prepTime.trim(),
          imagePublicId,
          ...(numericCalories && { calories: numericCalories }),
        }),
      });

      if (!menuResponse.ok) {
        const body = await menuResponse.json();
        throw new Error(body?.error || 'Failed to save menu item.');
      }

      setStatus('Menu item uploaded and saved successfully.');
      resetForm();
    } catch (uploadError: unknown) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
      setStatus('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="uploader-card">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Admin upload</p>
          <h2>Upload new menu image</h2>
        </div>
      </div>

      {error ? <p className="status-banner status-error">{error}</p> : null}
      {status ? <p className="status-banner">{status}</p> : null}

      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="menu-name">Name</label>
          <input
            id="menu-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Example: Spicy beef bowl"
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="menu-description">Description</label>
          <textarea
            id="menu-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="A short description of the dish"
            rows={3}
            required
          />
        </div>

        <div className="form-row grid-4">
          <div>
            <label htmlFor="menu-price">Price</label>
            <input
              id="menu-price"
              type="number"
              min="1"
              step="1"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="200"
              required
            />
          </div>

          <div>
            <label htmlFor="menu-calories">Calories</label>
            <input
              id="menu-calories"
              type="number"
              min="1"
              step="1"
              value={calories}
              onChange={(event) => setCalories(event.target.value)}
              placeholder="350"
            />
          </div>

          <div>
            <label htmlFor="menu-category">Category</label>
            <select
              id="menu-category"
              value={category}
              onChange={(event) => setCategory(event.target.value as MenuCategory)}
            >
              {CATEGORIES.map((entry) => (
                <option key={entry} value={entry}>
                  {entry.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="menu-preptime">Prep time</label>
            <input
              id="menu-preptime"
              type="text"
              value={prepTime}
              onChange={(event) => setPrepTime(event.target.value)}
              placeholder="15 min"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="menu-image">Menu image</label>
          <input
            id="menu-image"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            required
          />
        </div>

        <button type="submit" disabled={uploading} className="btn">
          {uploading ? 'Uploading...' : 'Upload and save'}
        </button>
      </form>
    </section>
  );
}
