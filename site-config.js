/**
 * Alchemy3D - academic project page configuration
 * Replace placeholder URLs / strings before publishing.
 */
window.SITE_CONFIG = {
  projectName: "Alchemy3D",
  /**
   * Cloud / CDN root for all relative asset paths.
   * ModelScope dataset: https://www.modelscope.cn/datasets/libd55/Alchemy3D-ProjectPage
   */
  assetBaseUrl:
    "https://www.modelscope.cn/datasets/libd55/Alchemy3D-ProjectPage/resolve/master/",
  logo: "assets/logo_alchemy3d.png",
  tagline: "Scalable 3D foundation model for versatile Assets Editing",
  conference: "Arxiv Preprint 2026",

  authors: [
    { name: "Badi Li", affiliationIds: [1, 2, 4] },
    {
      name: "Tianxin Huang",
      affiliationIds: [1],
      url: "https://tianxinhuang.github.io/",
    },
    { name: "Yu Zhou", affiliationIds: [3] },
    {
      name: "Wei-Shi Zheng",
      affiliationIds: [2, 4],
      url: "https://isee-ai.cn/~zhwshi/",
    },
    {
      name: "Yi Ma",
      affiliationIds: [1, 2],
      url: "https://www.cs.hku.hk/index.php/people/academic-staff/mayi",
    },
    {
      name: "Shenghua Gao",
      affiliationIds: [1, 2],
      corresponding: true,
      url: "https://scholar.google.com/citations?user=fe-1v0MAAAAJ&hl=zh-CN",
    },
  ],
  affiliations: [
    { id: 1, name: "The University of Hong Kong" },
    { id: 2, name: "Shenzhen Loop Area Institute" },
    { id: 3, name: "Shanghai Innovation Institute" },
    { id: 4, name: "Sun Yat-Sen University" },
  ],

  links: {
    paper: {
      label: "Paper (PDF)",
      url: "assets/Alchemy3D.pdf",
      enabled: true,
    },
    arxiv: {
      label: "Arxiv",
      url: "#",
      enabled: false,
      icon: "assets/icons/arxiv.png",
    },
    code: {
      label: "Code",
      url: "https://github.com/libd1/Alchemy3D",
      enabled: true,
      icon: "assets/icons/github.png",
      iconClass: "is-invert",
    },
    data: {
      label: "Data",
      url: "https://huggingface.co/datasets/libadi/Alchemy3D-1M",
      enabled: true,
      icon: "assets/icons/huggingface.png",
    },
    dataModelscope: {
      label: "Data",
      url: "https://modelscope.cn/datasets/libd55/Alchemy3D-1M",
      enabled: true,
      icon: "assets/icons/modelscope.png",
    },
    model: {
      label: "Model",
      url: "https://huggingface.co/libadi/Alchemy3D",
      enabled: true,
      icon: "assets/icons/huggingface.png",
    },
    modelModelscope: {
      label: "Model",
      url: "https://modelscope.cn/models/libd55/Alchemy3D",
      enabled: true,
      icon: "assets/icons/modelscope.png",
    },
    evaluation: {
      label: "Evaluation",
      url: "https://github.com/libd1/edit3dstudio",
      enabled: true,
      icon: "assets/icons/github.png",
      iconClass: "is-invert",
    },
    benchmark: {
      label: "Benchmark",
      url: "https://huggingface.co/datasets/libadi/GEdit3D-Bench",
      enabled: true,
      icon: "assets/icons/huggingface.png",
    },
    benchmarkModelscope: {
      label: "Benchmark",
      url: "https://modelscope.cn/datasets/libd55/GEdit3D-Bench",
      enabled: true,
      icon: "assets/icons/modelscope.png",
    },
  },

  abstract: [
    "Although recent 3D generative models produce increasingly realistic assets, controllable 3D asset editing remains challenging. Existing methods are limited by scarce training data, insufficient source-aware modeling, and a lack of practical evaluation protocols. To address these limitations, we present Alchemy3D, a unified framework for training and evaluating versatile 3D asset editors that covers data construction, model architecture, and benchmark evaluation. Specifically, we curate Alchemy3D-1M, a large-scale 3D editing dataset containing 1.25M assets and 1.38M editing pairs across seven editing types. On this data, we train a family of generative flow models for general-purpose 3D asset editing. The model family supports image- and text-conditioned editing, few-step inference, and transfer to multi-view 3D part segmentation. We further introduce GEdit3D-Bench, a large-scale, open-world benchmark with a multi-dimensional evaluation protocol. Across existing and newly introduced benchmarks, our method outperforms prior methods on most metrics of editing fidelity, source preservation, and visual quality. Our dataset, models, and benchmark will be made publicly available.",
  ],

  demoVideo: {
    src: "media/demo.mp4",
    poster: "media/poster.png",
    caption:
      "Teaser fly-through of edited 3D assets (placeholder - replace with final demo).",
  },

  teaserStill: "assets/teaser_still.png",

  /**
   * Animation sequence strips inside Results.
   * Each sequence is sparsified to ~5 GLB keyframes with prev/next arrows.
   */
  animSequences: {
    lead:
      "While not production-ready (Refer to the limitations section of the paper), we show the potential for Alchemy3D-Animations to repurpose character animations by 3D Editing. Click Download to view on a card to fetch frames.",
    sequences: [
      {
        id: "cxk",
        // Orientations are pre-baked into the GLB files (no runtime rotation).
        cameraOrbit: "0deg 70deg 105%",
        cameraTarget: "0m 0.05m 0m",
        fieldOfView: "28deg",
        exposure: "1",
        scale: "1.89 1.89 1.89",
        preview: "assets/previews/animations/cxk.jpg",
        frames: [
          { id: "000", src: "animations/cxk/000.glb" },
          { id: "006", src: "animations/cxk/006.glb" },
          { id: "012", src: "animations/cxk/012.glb" },
          { id: "021", src: "animations/cxk/021.glb" },
          { id: "023", src: "animations/cxk/023.glb" },
          { id: "024", src: "animations/cxk/024.glb" },
          { id: "025", src: "animations/cxk/025.glb" },
          { id: "029", src: "animations/cxk/029.glb" },
        ],
      },
      {
        id: "taffy",
        cameraOrbit: "0deg 70deg 105%",
        cameraTarget: "0m 0.05m 0m",
        fieldOfView: "28deg",
        exposure: "1",
        scale: "1.89 1.89 1.89",
        preview: "assets/previews/animations/taffy.jpg",
        frames: [
          { id: "000", src: "animations/taffy/000.glb" },
          { id: "004", src: "animations/taffy/004.glb" },
          { id: "008", src: "animations/taffy/008.glb" },
          { id: "013", src: "animations/taffy/013.glb" },
          { id: "017", src: "animations/taffy/017.glb" },
          { id: "019", src: "animations/taffy/019.glb" },
          { id: "021", src: "animations/taffy/021.glb" },
          { id: "025", src: "animations/taffy/025.glb" },
        ],
      },
    ],
  },

  /**
   * Segment showcases inside Results (one row, three wipe viewers).
   * Source vs semantic / instance prediction.
   */
  segmentShowcases: {
    lead:
      "Alchemy3D-Segment lifts 2D semantic and instance predictions onto edited 3D assets. Click Download to fetch assets; drag to orbit; drag the handle to wipe Source / Segmented.",
    items: [
      {
        id: "well",
        before: "segment/well/source.glb",
        after: "segment/well/semantic.glb",
        preview: "assets/previews/segment/well.jpg",
        beforeLabel: "Source",
        afterLabel: "Semantic",
        cameraOrbit: "8deg 67deg 4.25m",
        cameraTarget: "0m 0.06m 0m",
        fieldOfView: "26deg",
        exposure: "1",
        beforeScale: "1.89 1.89 1.89",
        afterScale: "1.89 1.89 1.89",
        orientation: "0deg 0deg 0deg",
        keepShaded: true,
      },
      {
        id: "viking",
        before: "segment/viking/source.glb",
        after: "segment/viking/semantic.glb",
        preview: "assets/previews/segment/viking.jpg",
        beforeLabel: "Source",
        afterLabel: "Semantic",
        cameraOrbit: "8deg 67deg 4.25m",
        cameraTarget: "0m 0.06m 0m",
        fieldOfView: "26deg",
        exposure: "1",
        beforeScale: "1.89 1.89 1.89",
        afterScale: "1.89 1.89 1.89",
        orientation: "0deg 0deg 0deg",
        keepShaded: true,
      },
      {
        id: "doctor",
        before: "segment/doctor/source.glb",
        after: "segment/doctor/semantic.glb",
        preview: "assets/previews/segment/doctor.jpg",
        beforeLabel: "Source",
        afterLabel: "Semantic",
        cameraOrbit: "8deg 67deg 4.25m",
        cameraTarget: "0m 0.06m 0m",
        fieldOfView: "26deg",
        exposure: "1",
        beforeScale: "1.89 1.89 1.89",
        afterScale: "1.89 1.89 1.89",
        orientation: "0deg 0deg 0deg",
        keepShaded: true,
      },
    ],
  },

  /**
   * Before / after comparison sliders (3 columns x N rows).
   * Paths match ModelScope upload layout: compare/NN_cat_id/{source,edited,cond}
   */
  comparisons: (function () {
    var pairs = [
      { cat: "add", id: "00035", caption: "Add a dollop of fluffy white whipped cream directly in the center of the flat caramel top." },
      { cat: "add", id: "00210", caption: "Add a heavy, notched iron pauldron armor piece onto his right shoulder." },
      { cat: "remove", id: "01425", caption: "Remove the black low-top sneakers from the character's feet." },
      { cat: "remove", id: "01431", caption: "Remove the C-shaped handle from the teal ceramic cup.", cameraOrbit: "90deg 67deg 4.25m" },
      { cat: "replace", id: "01812", caption: "Replace the brass corner brackets with dark, gothic-style iron corner braces." },
      { cat: "replace", id: "01820", caption: "Replace the translucent amber stem with a black bamboo-jointed stem." },
      { cat: "local_appearance", id: "01143", caption: "Change the color of the orange basketball to metallic gold." },
      { cat: "local_appearance", id: "01200", caption: "Modify the tan cork base to have a dark charcoal gray finish." },
      { cat: "global_appearance", id: "00773", caption: "Change the overall style to a sleek matte gold frame with dark obsidian stone panels and bench." },
      { cat: "global_appearance", id: "00841", caption: "Give the robot a high-tech carbon fiber finish with a vibrant neon orange screen display." },
      { cat: "animations", id: "00473", caption: "Lift the left hand to grasp the wooden recurve bow while raising the right arm to draw an arrow.", cameraOrbit: "8deg 67deg 3.85m", beforeScale: "1.62 1.62 1.62" },
      { cat: "animations", id: "00561", caption: "Bend the wooden rod downward as if under tension from a heavy catch.", cameraOrbit: "90deg 67deg 4.25m" }
    ];
    return pairs.map(function (pair, index) {
      var n = String(index + 1).padStart(2, "0");
      var folder = "compare/" + n + "_" + pair.cat + "_" + pair.id;
      return {
        type: "model",
        before: folder + "/source.glb",
        after: folder + "/edited.glb",
        // Cond PNG ships with the page (small); GLBs still load from assetBaseUrl.
        targetImage: "assets/compare/" + n + "_" + pair.cat + "_" + pair.id + "/cond.png",
        preview: "assets/previews/compare/" + n + ".jpg",
        beforeLabel: "Source",
        afterLabel: "Edited",
        targetLabel: "Cond",
        caption: pair.caption,
        beforeScale: pair.beforeScale || "1.89 1.89 1.89",
        afterScale: pair.afterScale || "1.89 1.89 1.89",
        beforeOffsetY: 0,
        cameraOrbit: pair.cameraOrbit || "8deg 67deg 4.25m",
        cameraTarget: "0m 0.06m 0m",
        fieldOfView: "26deg",
        exposure: "1",
      };
    });
  })(),


  results: [
    {
      src: "media/poster.png",
      caption: "Overview - multi-asset editing gallery (replace with figure).",
    },
    {
      src: "media/poster.png",
      caption: "Geometry-preserving edit example (replace with figure).",
    },
    {
      src: "media/poster.png",
      caption: "Material / appearance edit example (replace with figure).",
    },
  ],

  bibtex: "",

  footerNote:
    "Scalable 3D Foundation Model for Versatile Assets Editing",
};
