import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold">PortfolioRank</h1>
      <p className="mt-2">Priorización de portafolio por metodología multicriterio ponderada.</p>
      <div className="mt-6 flex gap-4">
        <Link className="rounded bg-blue-600 px-4 py-2 text-white" href="/api/auth/signin">
          Ingresar por magic link
        </Link>
        <Link className="rounded border px-4 py-2" href="/ranking">
          Ver ranking
        </Link>
      </div>
    </main>
  );
}
