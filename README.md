# VIS-4

## Overview
VIS-4 is a data visulation tool that enables you to visualize video data on objects in 3D space. After inputting a series of frames, you can track surface data over time. You can rotate around the object, select certain layers via cylindrical coordinates, and display basic central tendency measurements. 

## File Formatting
VIS-4 supports 3D objects (add the extension in paranthesis) in the form of:
1. CSV point clouds (.pt) 
2. <a href="https://en.wikipedia.org/wiki/STL_(file_format)">STL</a> objects (.stl) 

VIS-4 has two custom file formats: <br>
1. Frame Sequences (.frm)
2. Timestamp Sequences (.tp)

### Frame Sequences
File contains each vertex's values across the full range of frames, in a CSV format. 
Each row is a vector of frames associated with a vertex. These should appear in the order of the vertices in the geometry file (including duplicates). 

### Timestamp Sequences
File contains timestamps across the full range of frames, in a CSV format. 
This file should be just one row -- a vector with timestamps in seconds marking each frame. 

### Note: Memory Limitations
VIS-4 supports files under 1GB. Files beyond the memory limit may fail to render. 

## Getting Started
1. Open the website hosted <a href="https://kevinsun127.github.io/test_site/" target="_blank">here</a>.
2. Upload geometry file (.stl or .pt)
3. Upload frame sequence file (.frm)

You'll now be free to adjust your view of the object however you see fit. 

## Supported Features

### Frame/Point/Color Sliders
VIS-4 allows users to customize the object's rendering. The frame slider will render a specific frame, point size slider will change the global point size, and the color slider will set the minimum and maximum boundaries on the data. 

### Dynamic Video Playback
VIS-4 supports an adjustable FPS rate, along with play/pause/reverse controls. VIS-4 also supports timestamp uploads, helping you watch your 3D object develop in real time. 

### Central Tendency Measurements
VIS-4 can visualize central tendency measurements (maximum, mean, range, standard deviation) from the uploaded frame sequence data. 

### Color Scheme
VIS-4 supports customized color gradients. You can select among the pre-defined options on the browser, or modify the gradients according to hexadecimal values of your choice. 

### Layer Selection
VIS-4 employs a spherical coordinate system that can visualize a slice of an object. You can move a three-dimensional plane in space, using a levy of parameters -- including translating the coordinate system, rotating the axes, and limit the maximum distance from points to the plane. 




