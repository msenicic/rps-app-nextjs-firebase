import { DATA } from "@/data"
import Role from "@/components/Role";

export default function Roles({roomId}) {
  return (
    <div className="roles" style={{backgroundImage: "url('/bg-triangle.svg')"}}>
        {DATA.map((item, i)=>(
            <Role item={item} roomId={roomId} key={i} />
        ))}
    </div>
  )
}