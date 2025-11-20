import React from 'react';
import './MRIHome.css';

import mriGif from '../assets/mri.gif';
import brainScan from '../assets/brain-scan.png';
import mriMachine from '../assets/mri-machine.png';
import kneeScan from '../assets/knee-scan.png';

export default function MRIHome() {
  return (
<div className="mri-home">

<section className="top-hero">
  <div className="text-side">
    <h1>MRI ACCELERATION</h1>
    <p>Algorithm that speeds up MRI scans by reducing the amount of data collected while preserving image quality using advanced reconstruction technique.</p>
  </div>
  <div className="gif-side">
    <img src={mriGif} alt="MRI GIF" />
  </div>
</section>


{/* Info Band 1 */}
<section className="info-band blue-band">
  <div className="text">
    <p>We know MRI scans can be time-consuming and uncomfortable. But now patients who couldn't effectively be scanned before, even sick and uncooperative patients, can be scanned within seconds.</p>
  </div>
  <div className="image">
    <img src={brainScan} alt="Brain MRI" />
  </div>
</section>

{/* Info Band 2 */}
<section className="info-band dark-band">
  <div className="image">
    <img src={mriMachine} alt="MRI Machine" />
  </div>
  <div className="text">
    <p>That’s why we offer our product, which is a deep learning, untrained model solution that enables the reduction of MRI scans’ duration.</p>
  </div>
</section>

{/* Info Band 3 */}
<section className="info-band blue-band">
  <div className="text">
    <p>Our model is an untrained model which preserves your personal medical data including MRI scans. It reconstructs a full image of your scans with the same quality in less time.</p>
  </div>
  <div className="image">
    <img src={kneeScan} alt="Knee MRI" />
  </div>
</section>
</div>

  );
}
