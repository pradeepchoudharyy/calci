# Dual-Module Brain Tumor Detection (Enhancement + SVM)

This repository contains a **practical, reproducible** implementation of a dual-module pipeline inspired by the paper:

> Optimized Brain Tumor Detection: A Dual-Module Approach for MRI Image Enhancement and Tumor Classification (IEEE Access, 2024).

## What it does

**Module 1 — Image enhancement**
1. **Adaptive Wiener filter** (local) to reduce noise.
2. **RBF-style denoising** via **Kernel Ridge Regression (RBF kernel)** trained on image patches (proxy for the paper's RBF network + total variation minimization).
3. **FastICA** on [original, Wiener, RBF] channels to obtain de-mixed components; the component with **highest contrast score** is selected as the enhanced image.

**Module 2 — Tumor segmentation + SVM classification**
1. Otsu threshold, morphological cleanup, keep largest component.
2. Feature extraction (~133 dims): 10×10 **zoning**, projections (X/Y), **Euler number**, shape features, intensity stats (entropy, skewness, kurtosis, etc.).
3. **SVM (RBF kernel)** with standardization — cross-validated training and prediction.

## Quickstart

```bash
# 1) Install dependencies (Python 3.9+ recommended)
pip install numpy scipy scikit-image scikit-learn joblib

# 2) Save your dataset as a directory tree:
#    data/
#      meningioma/*.png
#      glioma/*.png
#      pituitary/*.png
#      normal/*.png        # (optional)

# 3) Train
python brain_tumor_dual_module.py train --data_dir data --model_out dual_module_svm.joblib --folds 5

# 4) Predict
python brain_tumor_dual_module.py predict --model dual_module_svm.joblib --image path/to/test_image.png

# 5) Enhancement-only (to visualize contrast-normalized output)
python brain_tumor_dual_module.py enhance --image path/to/image.png --out enhanced.png
```

## Notes & Assumptions

- **RBF network**: The paper uses an RBF neural network tied to a **total variation**-style criterion for denoising. Here, we provide a **robust, reproducible** substitution using **Kernel Ridge Regression with an RBF kernel** trained on patches (center-pixel regression). This yields smooth denoising behavior without requiring paired clean targets.
- **ICA selection**: We select the FastICA component with the **highest global contrast score** (percentile spread × gradient energy), mirroring the paper's observation that a particular component maximizes contrast.
- **Features**: We follow the paper's spirit (Euler number, zone-based descriptors, intensity & shape statistics). Exact feature sets in the paper can vary; feel free to extend `extract_features` as needed.
- **Dataset**: The code expects your own CE-MRI images. It does **not** fetch datasets automatically.
- **Metrics**: The CLI prints cross-validated accuracy, confusion matrix, and a report. If you need sensitivity/specificity per class, you can derive them from the confusion matrix or extend the code.

## Extending

- Swap the SVM with another classifier (e.g., RandomForest, XGBoost).
- Replace the RBF regressor with a learned RBF **neural** network if you want an end-to-end trainable denoiser.
- Integrate 3D volumes: process slice-wise or extend patch extraction to 3D.

---

**Disclaimer**: This implementation is intended for **research & educational** purposes and **is not a medical device**.
