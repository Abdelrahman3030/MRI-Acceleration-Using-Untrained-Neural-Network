# MRI-Acceleration-Using-Untrained-Neural-Network  
Accelerated MRI Reconstruction Using Untrained Neural Networks (Deep Image Prior–style optimization)

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![PyTorch](https://img.shields.io/badge/Framework-PyTorch-red.svg)

---

## 📌 Overview  
This repository implements **MRI reconstruction from undersampled k-space** using an **untrained neural network**, inspired by the *Deep Image Prior* principle.  
Instead of training on large datasets, the network is **optimized per scan** to reconstruct the full MRI image from sparse measurements — reducing MRI scan time while maintaining reconstruction quality.

This approach is flexible, data-efficient, and particularly useful when:
- Fully-sampled MRI datasets are unavailable  
- Undersampling patterns vary  
- You want reconstruction without supervised learning  

---

## 🚀 Key Features  
- UNet / ConvDecoder architecture implementations  
- Works directly on undersampled k-space data  
- No pretraining required (untrained DIP-style optimization)  
- GIF visualizations of reconstruction progress  
- Checkpoints, loss curves, and output comparisons  
- Flexible architecture & hyperparameter configuration  
- Large file support (via Git LFS recommended for .ckpt and .gif files)

---

## 📂 Project Structure  
```
MRI-Acceleration-Using-Untrained-Neural-Network/
│
├── ConvDecoder/                # Neural network architectures + checkpoints
│   └── UNET_trained/           # Example trained weights (.ckpt)
│
├── Pixel Perfect/              # Front-end assets (GIFs, visualizations)
│   └── src/assets/mri.gif      # 50MB MRI reconstruction animation
│
├── results/                    # Generated outputs (if applicable)
├── scripts/                    # Training / reconstruction scripts
├── data/                       # Example input (user provides own MRI data)
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
### **Prepare Your Data**
Place your undersampled k-space / mask files into the `data/` directory  
(or update paths inside the script).

### **Run Reconstruction**
```bash
python run_reconstruction.py     --data path/to/undersampled_kspace     --undersample_factor 8     --iters 3000     --lr 1e-3
```

### **Outputs**
- Reconstructed MRI images  
- Optional reconstruction GIFs  
- Checkpoints (`.ckpt`)  
- Comparison figures in `results/`  

---

## 📊 Example Reconstruction (GIF)  
This repository includes:

```
Pixel Perfect/src/assets/mri.gif
```

A 50MB GIF visualizing reconstruction progress.  
(Consider enabling Git LFS if editing large assets.)

---

## 📚 Background  
This project is based on the idea of optimizing an untrained CNN directly on a single input scan.  
Advantages:

- No dataset required  
- Avoids overfitting to training sets  
- Naturally regularizes solutions  
- Works even with highly sparse sampling

Related ideas:  
- **Deep Image Prior**  
- **Untrained neural priors for MRI**  
- **Plug-and-play reconstruction**

---

## ⚠️ Limitations  
- Slow: optimization is performed **per scan**  
- Not suitable for clinical production use  
- Large files should be tracked with Git LFS  
- Sensitive to hyperparameters and sampling masks  

---

## 🤝 Contributing  
Contributions are welcome!  
You can help by adding:

- Better architectures (e.g., DIP-UNet, SwinUNet, ConvNeXt blocks)  
- Faster optimization techniques  
- Multi-coil MRI support  
- Evaluation metrics (SSIM, PSNR)  

Open an issue or pull request anytime.

---

## 📜 License  
This project is licensed under the **MIT License**.  
See [LICENSE](LICENSE) for full details.

---

## 📣 Citation  
If you use this repository in research:

```
Abdelrahman3030. MRI-Acceleration-Using-Untrained-Neural-Network. GitHub, 2025.
```

---

## ⭐ If you found this useful  
Please consider starring ⭐ the repo!
