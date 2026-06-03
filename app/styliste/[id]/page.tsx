import { notFound } from "next/navigation";
import StylistProfileClient from "@/components/StylistProfileClient";
import { getStylistById } from "@/lib/stylists";

export default async function StylistProfilePage(
  props: PageProps<"/styliste/[id]">
) {
  const { id } = await props.params;
  const stylist = getStylistById(id);

  if (!stylist) {
    notFound();
  }

  return <StylistProfileClient stylist={stylist} />;
}
