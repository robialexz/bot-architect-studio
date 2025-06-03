export interface SubtitleSegment {
  start: number; // seconds
  end: number; // seconds
  text: string;
}

export interface SubtitleFile {
  language: 'en' | 'ro';
  segments: SubtitleSegment[];
}

export class SubtitleGenerator {
  private static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  }

  static generateSRT(subtitles: SubtitleFile): string {
    let srt = '';

    subtitles.segments.forEach((segment, index) => {
      srt += `${index + 1}\n`;
      srt += `${this.formatTime(segment.start)} --> ${this.formatTime(segment.end)}\n`;
      srt += `${segment.text}\n\n`;
    });

    return srt;
  }

  static generateVTT(subtitles: SubtitleFile): string {
    let vtt = 'WEBVTT\n\n';

    subtitles.segments.forEach((segment, index) => {
      vtt += `${index + 1}\n`;
      vtt += `${this.formatTime(segment.start)} --> ${this.formatTime(segment.end)}\n`;
      vtt += `${segment.text}\n\n`;
    });

    return vtt;
  }
}

// English subtitles
export const englishSubtitles: SubtitleFile = {
  language: 'en',
  segments: [
    {
      start: 0,
      end: 5,
      text: 'Meet AI Workflow Studio - the most advanced\nno-code AI automation platform.',
    },
    {
      start: 5,
      end: 10,
      text: 'Transform how businesses build\nintelligent workflows.',
    },
    {
      start: 15,
      end: 20,
      text: 'Why spend weeks coding when you can build\npowerful AI workflows in minutes?',
    },
    {
      start: 20,
      end: 25,
      text: 'Our intuitive drag-and-drop interface\nmakes AI accessible to everyone.',
    },
    {
      start: 30,
      end: 35,
      text: 'Watch how easy it is to create\ncomplex AI workflows.',
    },
    {
      start: 35,
      end: 40,
      text: 'Simply drag nodes from our\ncomprehensive library.',
    },
    {
      start: 40,
      end: 45,
      text: 'Connect them with a click and\nconfigure your AI models.',
    },
    {
      start: 60,
      end: 65,
      text: 'Integrate multiple AI models seamlessly.',
    },
    {
      start: 65,
      end: 70,
      text: 'Chain GPT-4 for text generation,\nClaude for analysis.',
    },
    {
      start: 70,
      end: 75,
      text: 'Add custom models for specialized tasks -\nall in one workflow.',
    },
    {
      start: 90,
      end: 95,
      text: 'Start fast with our professional templates\nor build from scratch.',
    },
    {
      start: 95,
      end: 100,
      text: 'Collaborate with your team in real-time,\nshare workflows.',
    },
    {
      start: 100,
      end: 105,
      text: 'Maintain version control and\nteam permissions.',
    },
    {
      start: 120,
      end: 125,
      text: 'Execute workflows instantly\nand see real results.',
    },
    {
      start: 125,
      end: 130,
      text: 'Monitor performance, track analytics,\nand optimize for maximum efficiency.',
    },
    {
      start: 150,
      end: 155,
      text: 'Why choose AI Workflow Studio?',
    },
    {
      start: 155,
      end: 160,
      text: 'Most comprehensive AI model support,\nfastest execution, best value.',
    },
    {
      start: 165,
      end: 170,
      text: 'Join thousands of companies\nalready saving time and money.',
    },
    {
      start: 170,
      end: 175,
      text: 'Reduce development costs by 80%,\nincrease productivity by 300%.',
    },
    {
      start: 175,
      end: 180,
      text: 'Deploy AI solutions 10x faster\nthan traditional methods.',
    },
    {
      start: 180,
      end: 185,
      text: 'Ready to revolutionize your business with AI?',
    },
    {
      start: 185,
      end: 190,
      text: 'Start your free trial today and build\nyour first intelligent workflow in minutes.',
    },
    {
      start: 190,
      end: 195,
      text: 'AI Workflow Studio - Build the Future',
    },
  ],
};

// Romanian subtitles
export const romanianSubtitles: SubtitleFile = {
  language: 'ro',
  segments: [
    {
      start: 0,
      end: 5,
      text: 'Întâlnește AI Workflow Studio - cea mai avansată\nplatformă de automatizare AI fără cod.',
    },
    {
      start: 5,
      end: 10,
      text: 'Transformă modul în care companiile construiesc\nfluxuri de lucru inteligente.',
    },
    {
      start: 15,
      end: 20,
      text: 'De ce să petreci săptămâni programând când poți\nconstrui fluxuri de lucru AI puternice în minute?',
    },
    {
      start: 20,
      end: 25,
      text: 'Interfața noastră intuitivă drag-and-drop\nface AI-ul accesibil pentru toți.',
    },
    {
      start: 30,
      end: 35,
      text: 'Urmărește cât de ușor este să creezi\nfluxuri de lucru AI complexe.',
    },
    {
      start: 35,
      end: 40,
      text: 'Pur și simplu trage nodurile din\nbiblioteca noastră comprehensivă.',
    },
    {
      start: 40,
      end: 45,
      text: 'Conectează-le cu un clic și\nconfigurează modelele tale AI.',
    },
    {
      start: 60,
      end: 65,
      text: 'Integrează multiple modele AI fără probleme.',
    },
    {
      start: 65,
      end: 70,
      text: 'Înlănțuie GPT-4 pentru generarea de text,\nClaude pentru analiză.',
    },
    {
      start: 70,
      end: 75,
      text: 'Adaugă modele personalizate pentru sarcini\nspecializate - toate într-un singur flux.',
    },
    {
      start: 90,
      end: 95,
      text: 'Începe rapid cu șabloanele noastre profesionale\nsau construiește de la zero.',
    },
    {
      start: 95,
      end: 100,
      text: 'Colaborează cu echipa ta în timp real,\npartajează fluxurile de lucru.',
    },
    {
      start: 100,
      end: 105,
      text: 'Menține controlul versiunilor și\npermisiunile echipei.',
    },
    {
      start: 120,
      end: 125,
      text: 'Execută fluxurile de lucru instantaneu\nși vezi rezultate reale.',
    },
    {
      start: 125,
      end: 130,
      text: 'Monitorizează performanța, urmărește analiticile\nși optimizează pentru eficiență maximă.',
    },
    {
      start: 150,
      end: 155,
      text: 'De ce să alegi AI Workflow Studio?',
    },
    {
      start: 155,
      end: 160,
      text: 'Cel mai comprehensiv suport pentru modele AI,\nexecuția cea mai rapidă, cea mai bună valoare.',
    },
    {
      start: 165,
      end: 170,
      text: 'Alătură-te miilor de companii care deja\neconomisesc timp și bani.',
    },
    {
      start: 170,
      end: 175,
      text: 'Reduce costurile de dezvoltare cu 80%,\ncrește productivitatea cu 300%.',
    },
    {
      start: 175,
      end: 180,
      text: 'Implementează soluții AI de 10 ori mai rapid\ndecât metodele tradiționale.',
    },
    {
      start: 180,
      end: 185,
      text: 'Gata să-ți revoluționezi afacerea cu AI?',
    },
    {
      start: 185,
      end: 190,
      text: 'Începe perioada de probă gratuită astăzi și\nconstruiește primul flux de lucru inteligent în minute.',
    },
    {
      start: 190,
      end: 195,
      text: 'AI Workflow Studio - Construiește Viitorul',
    },
  ],
};

// Generate subtitle files
export function generateSubtitleFiles(): { [key: string]: string } {
  return {
    'demo-video-en.srt': SubtitleGenerator.generateSRT(englishSubtitles),
    'demo-video-ro.srt': SubtitleGenerator.generateSRT(romanianSubtitles),
    'demo-video-en.vtt': SubtitleGenerator.generateVTT(englishSubtitles),
    'demo-video-ro.vtt': SubtitleGenerator.generateVTT(romanianSubtitles),
  };
}

// Export for use in build process
export default {
  englishSubtitles,
  romanianSubtitles,
  generateSubtitleFiles,
  SubtitleGenerator,
};
