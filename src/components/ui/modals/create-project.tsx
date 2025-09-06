import { Modal } from "@/components/modal";
import { closeModal } from "@/lib/utils";
import { FC } from "react";

export const CreateProjectModal: FC = () => {
	return (
		<Modal id='create-project' title='Create your project'>
			<div>
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut iusto,
				soluta aut ea voluptates necessitatibus in error nostrum id expedita
				quasi ipsam magni ad alias adipisci accusamus cupiditate eum at?
			</div>
		</Modal>
	);
};
