import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ auth, projects, queryParams = null }) {

    queryParams = queryParams || {}
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value
        } else {
            delete queryParams[name]
        }

        router.get(route('project.index'), queryParams)
    }

    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return
        searchFieldChanged(name, e.target.value)
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Projects" />

            <div className="py-12">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <div className="overflow-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-3">ID</th>
                                        <th className="px-3 py-3">Image</th>
                                        <th className="px-3 py-3">Name</th>
                                        <th className="px-3 py-3">Status</th>
                                        <th className="px-3 py-3">
                                            Created Date
                                        </th>
                                        <th className="px-3 py-3">Due Date</th>
                                        <th className="px-3 py-3">
                                            Created By
                                        </th>
                                        <th className="px-3 py-3 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-3"></th>
                                        <th className="px-3 py-3"></th>
                                        <th className="px-3 py-3">
                                            <TextInput 
                                                className="w-full" 
                                                defaultValue={queryParams.name}
                                                placeholder="Project Name" 
                                                onBlur={(e) => searchFieldChanged('name', e.target.value)}
                                                onKeyPress={(e) => onKeyPress('name', e)}
                                            />
                                        </th>
                                        <th className="px-3 py-3">
                                            <SelectInput 
                                                className="w-full"
                                                defaultValue={queryParams.status}
                                                onChange={(e) => searchFieldChanged('status', e.target.value)}
                                            >
                                                <option value="">Select</option>
                                                <option value="pending">Pending</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </SelectInput>
                                        </th>
                                        <th className="px-3 py-3">
                                        </th>
                                        <th className="px-3 py-3"></th>
                                        <th className="px-3 py-3">
                                        </th>
                                        <th className="px-3 py-3 text-right">
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.data.map((project) => (
                                        <tr
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            key={project.id}
                                        >
                                            <td className="px-3 py-2">
                                                {project.id}
                                            </td>
                                            <td className="px-3 py-2">
                                                <img
                                                    src={project.image_path}
                                                    style={{ width: 60 }}
                                                />
                                            </td>
                                            <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                                                <Link
                                                    href={route(
                                                        "project.show",
                                                        project.id
                                                    )}
                                                >
                                                    {project.name}
                                                </Link>
                                            </th>
                                            <td className="px-3 py-2">
                                                <span
                                                    className={
                                                        "px-2 py-1 rounded text-white"
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            "px-2 py-1 rounded text-white " +
                                                            PROJECT_STATUS_CLASS_MAP[
                                                                project.status
                                                            ]
                                                        }
                                                    >
                                                        {
                                                            PROJECT_STATUS_TEXT_MAP[
                                                                project.status
                                                            ]
                                                        }
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="px-3 py-2 text-nowrap">
                                                {project.created_at}
                                            </td>
                                            <td className="px-3 py-2 text-nowrap">
                                                {project.due_date}
                                            </td>
                                            <td className="px-3 py-2">
                                                {project.createdBy.name}
                                            </td>
                                            <td className="px-3 py-2 text-nowrap">
                                                <Link
                                                    href={route(
                                                        "project.edit",
                                                        project.id
                                                    )}
                                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={(e) =>
                                                        deleteProject(project)
                                                    }
                                                    className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={projects.meta.links}></Pagination>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
