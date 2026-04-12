"""
Image Utility Functions
Preprocessing and postprocessing helpers for the AI pipeline.
"""

import torch
import torchvision.transforms as transforms
import numpy as np
from PIL import Image


def preprocess_image(pil_image: Image.Image, size=(256, 192)) -> torch.Tensor:
    """
    Preprocess a PIL image for model input.

    Args:
        pil_image: Input PIL Image
        size: Target size as (height, width)

    Returns:
        Tensor of shape (1, 3, H, W) normalized to [-1, 1]
    """
    transform = transforms.Compose([
        transforms.Resize(size, interpolation=transforms.InterpolationMode.LANCZOS),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
    ])

    tensor = transform(pil_image).unsqueeze(0)  # Add batch dim
    return tensor


def postprocess_image(tensor: torch.Tensor) -> Image.Image:
    """
    Convert a model output tensor back to a PIL Image.

    Args:
        tensor: Tensor of shape (1, 3, H, W) in range [-1, 1]

    Returns:
        PIL Image
    """
    # Denormalize from [-1, 1] to [0, 1]
    tensor = tensor.squeeze(0).cpu()
    tensor = tensor * 0.5 + 0.5
    tensor = tensor.clamp(0, 1)

    # Convert to PIL
    np_image = (tensor.permute(1, 2, 0).numpy() * 255).astype(np.uint8)
    return Image.fromarray(np_image)


def resize_and_pad(image: Image.Image, target_size=(256, 192), fill_color=(255, 255, 255)):
    """
    Resize image maintaining aspect ratio and pad to target size.

    Args:
        image: Input PIL Image
        target_size: (height, width)
        fill_color: Background fill color

    Returns:
        Padded PIL Image
    """
    target_h, target_w = target_size
    w, h = image.size

    # Calculate scale
    scale = min(target_w / w, target_h / h)
    new_w = int(w * scale)
    new_h = int(h * scale)

    # Resize
    resized = image.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # Create padded image
    padded = Image.new('RGB', (target_w, target_h), fill_color)
    offset_x = (target_w - new_w) // 2
    offset_y = (target_h - new_h) // 2
    padded.paste(resized, (offset_x, offset_y))

    return padded


def create_agnostic_image(image: Image.Image, segmentation_map, target_regions=None):
    """
    Create an agnostic image by masking out certain body regions.
    Used as input to the try-on generator.

    Args:
        image: Original PIL Image
        segmentation_map: numpy array of shape (H, W) with class labels
        target_regions: List of class indices to mask out (default: upper body)

    Returns:
        Agnostic PIL Image with target regions masked
    """
    if target_regions is None:
        target_regions = [4, 14, 15, 18]  # upper_clothes, left_arm, right_arm, torso_skin

    np_image = np.array(image)
    mask = np.zeros(segmentation_map.shape[:2], dtype=bool)

    for region in target_regions:
        mask |= (segmentation_map == region)

    # Fill masked regions with gray
    np_image[mask] = [128, 128, 128]

    return Image.fromarray(np_image)
