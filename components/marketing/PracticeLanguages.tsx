import {practiceExercises} from '@/lib/marketing/practice';
import {practiceHubs, type PracticeHubLanguage} from '@/lib/marketing/practice-hubs';

const skills: Record<PracticeHubLanguage, string> = {
  javascript: 'Arrays, objects, sorting and strings',
  python: 'Dictionaries, list comprehensions, functions and strings',
  typescript: 'Typed functions, interfaces and generics',
  sql: 'SQLite filters, joins and grouped results',
  json: 'JSON syntax and configuration files',
};

export function PracticeLanguages() {
  return <section className="practice-language-picker" aria-labelledby="practice-language-heading">
    <h2 id="practice-language-heading">Choose a language and skill</h2>
    <p>Each exercise includes a runnable starter, hints and an explained solution. Choose a topic you already recognise, then try its edge case.</p>
    <nav aria-label="Practice by language">
      {(Object.keys(practiceHubs) as PracticeHubLanguage[]).map(language => {
        const hub = practiceHubs[language];
        const count = practiceExercises.filter(exercise => exercise.language === language).length;
        return <a key={language} href={'/practice/' + language}>
          <strong>{hub.name} exercises</strong>
          <span>{count} {count === 1 ? 'exercise' : 'exercises'} · {skills[language]}</span>
        </a>;
      })}
    </nav>
  </section>;
}
