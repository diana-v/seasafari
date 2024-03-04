import * as React from 'react';

export interface HomeProps {
    sectionTitle?: string;
    videoWebm?: string;
    videoMp4?: string;
    title?: string;
}

export const HomeLayout: React.FC<HomeProps> = ({ sectionTitle, videoWebm, videoMp4, title }) => (
    <div id={sectionTitle?.toLowerCase()} className="relative h-screen w-full">
        <video autoPlay muted loop preload={'preload'} className="h-screen w-full object-cover">
            <source src={videoMp4} type="video/mp4" />
            <source src={videoWebm} type="video/webm" />
        </video>
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-3xl md:text-5xl lg:text-7xl text-center uppercase text-white w-full lg:px-24">
            {title}
        </h1>
    </div>
);
