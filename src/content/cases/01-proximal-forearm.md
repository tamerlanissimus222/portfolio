---
order: 1
title: "Custom Transradial Prosthesis"
eyebrow: "Case 01 / Custom transradial prosthesis"
level: "Short congenital forearm residual limb"
context: "A 19-year-old experienced prosthesis user wanted a custom-themed design based on a reference he provided."
challenge: "Firm, low-compliance soft tissue made landmarks difficult to identify and narrowed the comfortable socket-volume range."
approach: "Landmarks were marked before scanning; the socket volume was iterated and the exterior refined in ZBrush."
validation:
  status: "REPLACEMENT PRINTED"
  summary: "A revised TPU inner socket was printed after a volume change, preserving compatibility with the existing outer structure."
tags:
  - 3D scanning
  - Socket iteration
  - Fusion 360
  - ZBrush
  - Morphlex TPU
  - Polycarbonate
narrative: true
stages:
  - id: "scan"
    title: "Reference / scanning"
    icon: "scan"
    media:
      - type: "carousel"
        role: "standard"
        aspect: "landscape"
        caption: "Clinical reference series"
        autoplayMs: 2000
        slides:
          - src: "media/case1-originals/scanning-reference-01.jpg"
            alt: "Anonymised comparison used as a clinical reference before scanning."
            caption: "Clinical reference"
          - src: "media/case1-originals/scanning-reference-02.jpg"
            alt: "Anonymised residual-limb geometry viewed from above."
            caption: "Residual-limb geometry"
          - src: "media/case1-originals/scanning-reference-03.jpg"
            alt: "Anonymised residual limb positioned during range-of-motion assessment."
            caption: "Range-of-motion reference"
      - type: "youtube"
        role: "standard"
        aspect: "wide"
        youtubeId: "5fOTYZr9qmY"
        poster: "media/case1-originals/modelling-process-preview.png"
        alt: "Video poster showing the digital socket modelling process."
        caption: "Modelling process"

  - id: "modelling"
    title: "Digital model / prosthesis in use"
    icon: "cad"
    media:
      - type: "model3d"
        role: "standard"
        aspect: "square"
        embedUrl: "case1-viewer"
        poster: "media/case1-originals/interface-study-preview.png"
        alt: "Preview of the scan-to-socket assembly model."
        caption: "Socket assembly · 3D model"
      - type: "carousel"
        role: "standard"
        aspect: "portrait"
        caption: "Design and manufactured socket views"
        autoplayMs: 3000
        slides:
          - src: "media/case1-originals/manufacturing-assembly.jpg"
            alt: "Manufactured black prosthetic socket with a light inner liner."
            caption: "Manufactured assembly"
          - src: "media/case1-originals/manufacturing-side.jpg"
            alt: "Side view of the manufactured socket and inner liner."
            caption: "Side geometry"
          - src: "media/case1-originals/manufacturing-rear.jpg"
            alt: "Rear view of the manufactured socket prototype."
            caption: "Rear geometry"
          - src: "media/case1-originals/inner-socket-preview.png"
            alt: "Digital preview of the flexible inner socket."
            caption: "Inner socket · CAD preview"
          - src: "media/case1-originals/outer-socket-preview.png"
            alt: "Digital preview of the rigid outer socket."
            caption: "Outer socket · CAD preview"
      - type: "youtube"
        role: "standard"
        aspect: "wide"
        youtubeId: "RofdD_3p7cM"
        poster: "media/case1-originals/prosthesis-demonstration-preview.jpg"
        alt: "Video poster showing a forearm prosthesis being demonstrated."
        caption: "Prosthesis demonstration"

  - id: "fitting"
    title: "Fitting / validation"
    icon: "fit"
    validation: true
    media:
      - type: "youtube"
        role: "standard"
        aspect: "landscape"
        youtubeId: "Go_BdPuMweI"
        poster: "media/case1-originals/fitting-preview.png"
        alt: "Video poster showing the prosthesis fitting and range-of-motion check."
        caption: "Final fitting check"
---

This prosthesis was developed for a 19-year-old user with a short congenital forearm residual limb. Having previously used prosthetic devices, he wanted something beyond standard functionality this time: a custom-themed design based on a reference <a href="https://sketchfab.com/3d-models/bionic-arm-horizon-zero-dawn-concept-8fcd315dfbda4eda94e327519764690b" target="_blank" rel="noopener noreferrer">concept</a> he provided.

The main challenge, however, was not the external design but the user's anatomy and soft tissue characteristics. An elevated BMI and a thick layer of firm, relatively low-compliance subcutaneous tissue made anatomical landmarks difficult to identify visually. These characteristics also significantly narrowed the range of socket volumes that could provide a comfortable fit.

Before 3D scanning, I marked key anatomical landmarks on the residual limb to make them identifiable in the resulting scan. These markers helped me position the functional regions of the socket during digital modelling. Nevertheless, achieving a comfortable socket volume required a second iteration. The first socket provided a snug fit and a strong sense of prosthetic control, but also created excessive negative pressure, making it uncomfortable during prolonged use.

The external design also went through two iterations. Initially, I aimed to model an anatomically inspired muscular relief of the forearm from scratch in CAD. The initial CAD model <a href="media/case1-originals/initial-cad-model.png" data-case-media-open data-media-type="image" data-media-caption="Initial CAD model" data-media-alt="Initial CAD model of the prosthesis before refinement in ZBrush" aria-haspopup="dialog">did not meet my aesthetic expectations</a>, so I refined the geometry in ZBrush to achieve a more organic and natural-looking form.

The prosthesis consisted of a flexible inner socket made from Morphlex TPU and a rigid outer socket made from polycarbonate (PC).

The fitting photos and videos show the prosthesis after three months of use. During this period, the user gained weight, making the original flexible TPU socket too tight. An attempt to expand the socket by heating and reshaping it resulted in damage to the TPU structure.

In a digital prosthetics workflow, this type of issue can be addressed much more efficiently than manufacturing a new socket from scratch. Since I was already aware of the user's need for a volume adjustment, and the original digital model remained fully editable, I increased the internal volume of the flexible socket while maintaining compatibility with the other prosthetic components. I then 3D-printed a replacement. The prosthesis only needed to be reassembled with the new inner socket, without having to reproduce the external structure.
