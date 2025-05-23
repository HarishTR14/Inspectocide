# Inspectocide 🕵️‍♂️

A simple, no-nonsense browser extension that helps visualize element boundaries and structure—because Pesticide is no longer supported. Inspired by **Pesticide**, but with some extra features to make debugging layouts a bit easier.

## 💡 Inspiration
I always used **Pesticide** when I had doubts about element layouts. One day, while debugging a tricky UI, I realized that **Pesticide was no longer supported.** So, I decided to build my own version—**Inspectocide** (yeah, very "original").

## 🚀 Features
- **Tag Labels**: Displays the HTML tag name on top of elements.
- **Outlines**: Adds a colored outline to all elements.  
- **Tag Hover Info**: Hold `Shift` and hover over an element to see its tag and classes.("original")
- **Copy Class Names**: Press `Shift + C` while hovering to copy the element's class list—so you can easily search for it in your code editor.

## 🎯 Usage
1. Install the extension.
2. Enable it under the extensions.
3. Hold `Shift` to view tag information.
4. Press `Shift + C` to copy the class names.
5. Disable it anytime.

## 🛠️ Installation  
Currently, this is a **manual install** because I am broke to publish it in the Chrome Web Store. To use it:  
1. Clone this repository.  
2. Open Chrome and go to `chrome://extensions/`.  
3. Enable **Developer Mode**.  
4. Click **Load Unpacked** and select the extension folder.  

## 🎨 Customization
Want different colors for different tags? Modify `getColorForTag(tag)` in the script.

## 🤝 Contributing
Pull requests are welcome! If you have ideas to make Inspectocide even more useful, feel free to open an issue or submit a PR.


---

Enjoy debugging your layouts with **Inspectocide**! 🔍✨

