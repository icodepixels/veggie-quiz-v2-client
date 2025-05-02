import QuizList from './components/QuizList';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Veggie Quiz</h1>
      <QuizList />
    </main>
  );
}
