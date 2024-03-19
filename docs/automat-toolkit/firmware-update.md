---
layout: default
title: Firmware Update
nav_order: 4
parent: automat controller
grand_parent: automat toolkit
permalink: /docs/automat-toolkit/automat-controller/firmware-update/
---

# Firmware Update


## Short Version
If your AUTOMAT does not show up as a USB MIDI Device. It is probably in “Update Mode”. This happens if you double press the RESET Button. To go back to the normal operation mode.

1. For firmware version 2.0.0 download the following file: https://dadamachines.com/download/automat-sw_2.0.0.ino.automat.uf2

2. Move it / Drag it on the USB DEVICE / STICK called “AUTOMAT” which should be visible in your (Explorer – Windows) / (Finder – OSX).

3. The “USB Stick” called “AUTOMAT” should be ejected now and ready to operate.If you still see the “USB Stick” called “AUTOMAT” please follow the Long Version of this Guide below.

For the old firmware Version 1.0 download the following file: https://dadamachines.com/download/automat-sw_1.0.0.ino.automat.uf2



## Long Version
1. Please download the following file: https://dadamachines.com/download/dadaupdatefilesnew_2.0.0.zip

2. Go to your download folder and unzip the files, if they aren’t unpacked already.

3. Now. Open your Terminal Application. By going on the Spotlight / Search Icon in the Top Menu Bar of MacOs and typing “Terminal” and hitting Enter.

4. Type “cd” in the new Terminal Window, and add one SPACE after the two letters.
```
cd
```

5. Drag the Folder named “dadaupdatefiles” on the Terminal Window. What you see now should look similar to my the screenshot below. >> NOW hit Enter

6. Now you should be inside of the Folder on the Commandline / Terminal

7. Now you can copy the following Command to the Terminal Window
```
dd if=automat_update_180219.bin of=/Volumes/AUTOMAT/automat_update_180219.bin conv=notrunc
```
NOW hit Enter

8. You will see something like this:

9. Now please and this is IMPORTANT use the Arrow Up Key on your Keyboard inside the Terminal Window to go back to the last Command and hit Enter again. (do this like 5 times)

10. Standard firmware Copy the following Command to the Terminal Window: 
```
dd if=automat-sw_1.0.0.ino.automat.uf2 of=/Volumes/AUTOMAT/automat-sw_1.0.0.ino.automat.uf2 conv=notrunc
```
NOW hit Enter

10. Version 2.0.0 firmware with velocity support  Copy the following Command to the Terminal Window:
```
dd if=automat-sw_2.0.0.ino.automat.uf2 of=/Volumes/AUTOMAT/automat-sw_2.0.0.ino.automat.uf2 conv=notrunc
```
NOW hit Enter

11. The AUTOMAT Device / USB Drive should now disappear from your FINDER.>> Press the LEARN Button > The right one seen from the backside once for simple learn or twice for advanced learn>> Send one Note for simple learn (the lowest one > 11 others will be stacked up from that root note and assigned to the outputs 2-12)>> Send one Note for each single Output 1-12 in advanced learn mode

If you still have trouble, please contact Support at hi@dadamachines.com