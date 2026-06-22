export default function ResidenceDetailPage({
  params,
}: {
  params: { typeId: string }
}) {
  return <main className="p-8 font-display text-4xl">Detail: {params.typeId}</main>
}
