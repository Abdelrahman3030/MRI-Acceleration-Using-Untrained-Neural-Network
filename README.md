# MRI-Acceleration-Using-Untrained-Neural-Network  
Accelerated MRI Reconstruction Using Untrained Neural Networks (Deep Image Prior–style optimization)

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![PyTorch](https://img.shields.io/badge/Framework-PyTorch-red.svg)

---

## 📌 Overview  
This repository implements **MRI reconstruction from undersampled k-space** using an **untrained neural network**, inspired by the *Deep Image Prior* principle.  
Instead of training on large datasets, the network is **optimized per scan** to reconstruct the full MRI image from sparse measurements — reducing MRI scan time while maintaining reconstruction quality.

---

## 🧠 Methodology Summary
This project builds on three major untrained neural architectures:

### **1. Deep Image Prior (DIP)**
A randomly-initialized CNN is optimized to fit the target MRI slice directly.

### **2. Deep Decoder**
A lightweight upsampling-based architecture.

### **3. ConvDecoder (Main Model)**
An untrained CNN with:
- convolutional blocks  
- upsampling layers  
- multi-domain loss functions  
- data consistency terms  
- optional NUFFT support for non-Cartesian trajectories

ConvDecoder forms the core MRI reconstruction pipeline.

---

## 🚀 Key Technical Contributions
### **1. ConvDecoder outperforms other untrained methods**
Experiments show ConvDecoder outperforming:
- DIP  
- Deep Decoder  
- TV minimization  
- ENLIVE  

Achieves competitive SSIM/PSNR vs trained U-Nets.

### **2. 10× Faster Reconstruction**
A domain-specific initialization reduces reconstruction time:
- **From 60 minutes → 6 minutes**  
with minimal quality loss.

### **3. Multi-Loss ConvDecoder**
Combines spatial, perceptual, and frequency losses for robust reconstructions.

### **4. Non-Cartesian MRI Support**
NUFFT-based forward model enables reconstruction of:
- radial  
- spiral  
- arbitrary trajectories  

### **5. Ensemble ConvDecoder**
Multiple ConvDecoders with different initializations improve fine-detail quality.

---

## 📊 Results Summary
Based on experiments from the documentation:

- ConvDecoder ≈ U-Net on many metrics  
- ConvDecoder > TV & ENLIVE consistently  
- ConvDecoder > DIP/Deep Decoder on knee MRI  
- Brain MRI: untrained methods behave similarly  
- Non-Cartesian reconstructions achieve:  
  - **SSIM up to 0.98**  
  - **PSNR up to ~41.8 dB**

---

## 📂 Project Structure  
```
MRI-Acceleration-Using-Untrained-Neural-Network/
│
├── ConvDecoder/
│   └── UNET_trained/
│
├── Pixel Perfect/
│   └── src/assets/mri.gif
│
├── results/
├── scripts/
├── data/
├── docs/
│   └── Project_Report.pdf
│
├── README.md
└── LICENSE
```

---

## 🛠️ Installation  
```bash
git clone https://github.com/Abdelrahman3030/MRI-Acceleration-Using-Untrained-Neural-Network.git
cd MRI-Acceleration-Using-Untrained-Neural-Network
pip install -r requirements.txt
```

---

## ▶️ Usage  
### Step 1 — Prepare Data  
Place undersampled k-space files into `data/`.

### Step 2 — Run Reconstruction  
```bash
python run_reconstruction.py     --data path/to/kspace     --undersample_factor 8     --iters 3000     --lr 1e-3
```

### Outputs  
- reconstructed MRI  
- GIFs  
- checkpoints  
- results in `/results`

---

## 🏗️ System Architecture Overview
### **Frontend**
- React.js  
- Redux  
- SCSS  
- canvas viewer  
- light/dark mode  

### **Backend**
- Flask API for ML  
- Node.js email microservice  
- Resend API  
- Google Colab compute backend  

### **Workflow**
1. User uploads MRI  
2. Flask pipes it to ConvDecoder  
3. MRI processed locally or via Colab  
4. Email sent on completion (for MRI)  
5. Images processed instantly  

---

## 🤝 Contributing  
Contributions welcome!  
Ideas:
- new architectures  
- faster optimization  
- multi-coil MRI  
- more metrics (SSIM/PSNR logs)

---

## 📜 License  
MIT License — see `LICENSE`.

---

## 📣 Citation  
```
Abdelrahman3030. MRI-Acceleration-Using-Untrained-Neural-Network. GitHub, 2025.
```
